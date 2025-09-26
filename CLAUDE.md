# Audio Description Protocol Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-26

## Project Purpose
Creating a spec-driven framework (Audio Description Protocol, ADP) for describing musical audio clips with text so humans ⟷ AIs can interoperate. Include dictionary labels, annotations with time ranges/confidence, dataset manifests, and model outputs. Python+PyTorch preferred.
'''

## Spec Kit & Spec Driven Development
The .specify and specs folders show the Spec Kit approach to development. .claude/commands have slash commands to drive the 4-step sdd iterations


## Active Technologies
- Python 3.11+ (constitutional requirement: Python + PyTorch first) + PyTorch, jsonschema, librosa/torchaudio (audio processing), pytest (testing) (001-create-a-spec)

## Project Structure
```
src/
tests/
```

## Commands
cd src [ONLY COMMANDS FOR ACTIVE TECHNOLOGIES][ONLY COMMANDS FOR ACTIVE TECHNOLOGIES] pytest [ONLY COMMANDS FOR ACTIVE TECHNOLOGIES][ONLY COMMANDS FOR ACTIVE TECHNOLOGIES] ruff check .

## Code Style
Python 3.11+ (constitutional requirement: Python + PyTorch first): Follow standard conventions

## Recent Changes
- 001-create-a-spec: Added Python 3.11+ (constitutional requirement: Python + PyTorch first) + PyTorch, jsonschema, librosa/torchaudio (audio processing), pytest (testing)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->