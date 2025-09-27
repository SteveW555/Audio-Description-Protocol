"""
Musical annotation validation commands for ADP CLI.

This module provides specialized commands for validating musical annotations,
checking music theory constraints, and semantic descriptions.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Set

from ..validation import SchemaResolver
from ..models import MusicalAnnotation


class MusicalAnnotationValidator:
    """Specialized validator for musical annotation files."""

    def __init__(self, schema_resolver: Optional[SchemaResolver] = None):
        """Initialize with optional schema resolver."""
        self.resolver = schema_resolver or SchemaResolver()

    def validate_musical_annotation_file(self, file_path: Path) -> bool:
        """Validate a single musical annotation file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.resolver.validate(data, "musical_annotation")
            return True

        except Exception as e:
            print(f"Musical annotation validation failed: {e}")
            return False

    def validate_music_theory(self, annotation_data: dict) -> List[str]:
        """Validate music theory constraints."""
        errors = []

        musical_analysis = annotation_data.get("musical_analysis", {})
        theory = musical_analysis.get("theory", {})

        # BPM validation
        bpm = theory.get("bpm")
        if bpm is not None:
            if not isinstance(bpm, (int, float)):
                errors.append(f"BPM must be numeric, got {type(bpm)}")
            elif bpm < 40 or bpm > 300:
                errors.append(f"BPM ({bpm}) outside realistic range [40, 300]")

        # Key validation
        key = theory.get("key")
        if key is not None:
            valid_keys = [
                "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb",
                "G", "G#", "Ab", "A", "A#", "Bb", "B"
            ]
            if key not in valid_keys:
                errors.append(f"Invalid key: {key}")

        # Key confidence validation
        key_confidence = theory.get("key_confidence")
        if key_confidence is not None:
            if not isinstance(key_confidence, (int, float)):
                errors.append(f"Key confidence must be numeric, got {type(key_confidence)}")
            elif key_confidence < 0.0 or key_confidence > 1.0:
                errors.append(f"Key confidence ({key_confidence}) outside range [0.0, 1.0]")

        # Chord validation
        chords = theory.get("chords", [])
        for i, chord in enumerate(chords):
            chord_errors = self._validate_chord(chord, i)
            errors.extend(chord_errors)

        # Roman numeral validation
        roman_numerals = theory.get("roman_numerals", [])
        for i, numeral in enumerate(roman_numerals):
            if not self._is_valid_roman_numeral(numeral):
                errors.append(f"Invalid roman numeral at position {i}: {numeral}")

        return errors

    def validate_semantic_description(self, annotation_data: dict) -> List[str]:
        """Validate semantic description constraints."""
        errors = []

        musical_analysis = annotation_data.get("musical_analysis", {})
        semantic = musical_analysis.get("semantic_description", {})

        # Genre validation
        genre = semantic.get("genre", {})
        if genre:
            primary = genre.get("primary")
            if primary and not isinstance(primary, str):
                errors.append(f"Primary genre must be string, got {type(primary)}")

            secondary = genre.get("secondary", [])
            if secondary and not isinstance(secondary, list):
                errors.append(f"Secondary genres must be array, got {type(secondary)}")

        # Attributes validation
        attributes = semantic.get("attributes", {})
        for attr_name, attr_values in attributes.items():
            if not isinstance(attr_values, list):
                errors.append(f"Attribute {attr_name} must be array, got {type(attr_values)}")

        # Instrumentation validation
        instrumentation = semantic.get("instrumentation", [])
        for i, instrument in enumerate(instrumentation):
            inst_errors = self._validate_instrument(instrument, i)
            errors.extend(inst_errors)

        # Vocals validation
        vocals = semantic.get("vocals", {})
        if vocals:
            presence = vocals.get("presence")
            valid_presence = ["none", "lead", "backing", "harmony", "spoken"]
            if presence and presence not in valid_presence:
                errors.append(f"Invalid vocal presence: {presence}")

        return errors

    def validate_time_consistency(self, annotation_data: dict) -> List[str]:
        """Validate time consistency between annotation and musical analysis."""
        errors = []

        # Get annotation time range
        time_range = annotation_data.get("time_range", {})
        start_sec = time_range.get("start_sec", 0)
        end_sec = time_range.get("end_sec", 0)

        musical_analysis = annotation_data.get("musical_analysis", {})
        theory = musical_analysis.get("theory", {})

        # Check chord timing consistency
        chords = theory.get("chords", [])
        for i, chord in enumerate(chords):
            chord_time = chord.get("time", 0)
            if chord_time < start_sec or chord_time > end_sec:
                errors.append(f"Chord {i} time ({chord_time}s) outside annotation range [{start_sec}s, {end_sec}s]")

        return errors

    def validate_confidence_scores(self, annotation_data: dict) -> List[str]:
        """Validate all confidence scores in musical annotation."""
        errors = []

        musical_analysis = annotation_data.get("musical_analysis", {})
        theory = musical_analysis.get("theory", {})

        # Key confidence
        key_confidence = theory.get("key_confidence")
        if key_confidence is not None:
            if key_confidence < 0.0 or key_confidence > 1.0:
                errors.append(f"Key confidence ({key_confidence}) outside range [0.0, 1.0]")

        # Chord confidences
        chords = theory.get("chords", [])
        for i, chord in enumerate(chords):
            confidence = chord.get("confidence")
            if confidence is not None:
                if confidence < 0.0 or confidence > 1.0:
                    errors.append(f"Chord {i} confidence ({confidence}) outside range [0.0, 1.0]")

        return errors

    def validate_musical_directory(self, annotations_dir: Path) -> Dict[str, any]:
        """Validate all musical annotations in a directory."""
        results = {
            "valid": [],
            "invalid": [],
            "total_errors": 0,
            "theory_errors": [],
            "semantic_errors": [],
            "time_errors": [],
            "confidence_errors": []
        }

        if not annotations_dir.exists():
            print(f"❌ Musical annotations directory not found: {annotations_dir}")
            return results

        for ann_file in annotations_dir.glob("*.json"):
            file_valid = True
            file_errors = []

            try:
                with open(ann_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Basic schema validation
                try:
                    self.resolver.validate(data, "musical_annotation")
                except Exception as e:
                    file_errors.append(f"Schema validation: {e}")
                    file_valid = False

                # Music theory validation
                theory_errors = self.validate_music_theory(data)
                if theory_errors:
                    file_errors.extend(theory_errors)
                    results["theory_errors"].extend([(str(ann_file), err) for err in theory_errors])
                    file_valid = False

                # Semantic description validation
                semantic_errors = self.validate_semantic_description(data)
                if semantic_errors:
                    file_errors.extend(semantic_errors)
                    results["semantic_errors"].extend([(str(ann_file), err) for err in semantic_errors])
                    file_valid = False

                # Time consistency validation
                time_errors = self.validate_time_consistency(data)
                if time_errors:
                    file_errors.extend(time_errors)
                    results["time_errors"].extend([(str(ann_file), err) for err in time_errors])
                    file_valid = False

                # Confidence score validation
                conf_errors = self.validate_confidence_scores(data)
                if conf_errors:
                    file_errors.extend(conf_errors)
                    results["confidence_errors"].extend([(str(ann_file), err) for err in conf_errors])
                    file_valid = False

            except Exception as e:
                file_errors.append(f"File processing error: {e}")
                file_valid = False

            if file_valid:
                results["valid"].append(str(ann_file))
            else:
                results["invalid"].append((str(ann_file), file_errors))
                results["total_errors"] += len(file_errors)

        return results

    def _validate_chord(self, chord: dict, index: int) -> List[str]:
        """Validate a single chord entry."""
        errors = []

        # Time validation
        time = chord.get("time")
        if time is None:
            errors.append(f"Chord {index}: missing time")
        elif not isinstance(time, (int, float)):
            errors.append(f"Chord {index}: time must be numeric")
        elif time < 0:
            errors.append(f"Chord {index}: time must be non-negative")

        # Chord symbol validation
        chord_symbol = chord.get("chord")
        if not chord_symbol:
            errors.append(f"Chord {index}: missing chord symbol")
        elif not self._is_valid_chord_symbol(chord_symbol):
            errors.append(f"Chord {index}: invalid chord symbol format: {chord_symbol}")

        # Confidence validation
        confidence = chord.get("confidence")
        if confidence is not None:
            if not isinstance(confidence, (int, float)):
                errors.append(f"Chord {index}: confidence must be numeric")
            elif confidence < 0.0 or confidence > 1.0:
                errors.append(f"Chord {index}: confidence outside range [0.0, 1.0]")

        return errors

    def _validate_instrument(self, instrument: dict, index: int) -> List[str]:
        """Validate a single instrument entry."""
        errors = []

        # Instrument name
        name = instrument.get("instrument")
        if not name:
            errors.append(f"Instrument {index}: missing instrument name")

        # Role validation
        role = instrument.get("role")
        valid_roles = ["lead", "rhythm", "bass", "percussion", "harmony", "solo", "ensemble"]
        if not role:
            errors.append(f"Instrument {index}: missing role")
        elif role not in valid_roles:
            errors.append(f"Instrument {index}: invalid role: {role}")

        # Descriptors validation
        descriptors = instrument.get("descriptors", [])
        if descriptors and not isinstance(descriptors, list):
            errors.append(f"Instrument {index}: descriptors must be array")

        return errors

    def _is_valid_chord_symbol(self, chord_symbol: str) -> bool:
        """Validate chord symbol format (root:quality)."""
        if ":" not in chord_symbol:
            return False

        root, quality = chord_symbol.split(":", 1)

        # Valid roots
        valid_roots = [
            "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb",
            "G", "G#", "Ab", "A", "A#", "Bb", "B"
        ]

        # Valid qualities (basic set)
        valid_qualities = [
            "maj", "min", "dim", "aug", "sus2", "sus4",
            "maj7", "min7", "dom7", "dim7", "hdim7"
        ]

        return root in valid_roots and quality in valid_qualities

    def _is_valid_roman_numeral(self, numeral: str) -> bool:
        """Validate roman numeral format."""
        valid_numerals = [
            "I", "II", "III", "IV", "V", "VI", "VII",
            "i", "ii", "iii", "iv", "v", "vi", "vii",
            "♭II", "♭III", "♭VI", "♭VII", "#IV", "#V"
        ]

        # Allow basic modifiers
        base_numeral = numeral.replace("°", "").replace("+", "").replace("7", "")
        return base_numeral in valid_numerals


def validate_musical_annotation_command(file_path: Path, strict: bool = False) -> bool:
    """Command function for musical annotation validation."""
    validator = MusicalAnnotationValidator()

    # Load annotation data
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load musical annotation file: {e}")
        return False

    # Basic schema validation
    if not validator.validate_musical_annotation_file(file_path):
        return False

    errors = []

    # Music theory validation
    theory_errors = validator.validate_music_theory(data)
    errors.extend(theory_errors)

    # Semantic description validation
    semantic_errors = validator.validate_semantic_description(data)
    errors.extend(semantic_errors)

    # Time consistency validation
    time_errors = validator.validate_time_consistency(data)
    errors.extend(time_errors)

    # Confidence score validation
    conf_errors = validator.validate_confidence_scores(data)
    errors.extend(conf_errors)

    if errors:
        print(f"❌ Musical annotation validation failed:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print(f"✅ Musical annotation validation passed")
        return True


def validate_music_theory_command(file_path: Path) -> bool:
    """Command function for validating music theory constraints specifically."""
    validator = MusicalAnnotationValidator()

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load file: {e}")
        return False

    theory_errors = validator.validate_music_theory(data)
    conf_errors = validator.validate_confidence_scores(data)
    time_errors = validator.validate_time_consistency(data)

    all_errors = theory_errors + conf_errors + time_errors

    if all_errors:
        print(f"❌ Music theory validation failed:")
        for error in all_errors:
            print(f"  - {error}")
        return False
    else:
        print(f"✅ Music theory constraints validated")
        return True