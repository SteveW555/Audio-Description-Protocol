# RTX 5080 sm_120 PyTorch Experiment

**Branch:** `test-sm120-pytorch`
**Date:** 2025-10-05
**Status:** ⏸️ Paused - Build incomplete, awaiting official PyTorch support

## Objective

Attempt to enable GPU acceleration for the RTX 5080 (compute capability sm_120) by building PyTorch from source with custom CUDA architecture flags.

## Background

- **Hardware:** NVIDIA RTX 5080 (requires sm_120 support)
- **Problem:** Official PyTorch 2.8.0 does not include sm_120 support
- **Current State:** Using PyTorch 2.8.0+cpu (CPU-only) successfully
- **Training:** Working well on CPU, no issues

## What We Tried

### Environment Setup

1. **Created isolated experimental branch:** `test-sm120-pytorch`
2. **Backed up working environment:** `.venv` → `.venv.backup-cpu`
3. **Created new venv:** `.venv-sm120` for testing

### Build Attempt

Based on previous build session documented in `pytorchbuild.txt`:

1. **Build Environment:**
   - x64 Native Tools Command Prompt for VS 2022
   - MSVC Compiler: 19.44.35215
   - CMake: 4.1.0
   - CUDA: 12.8
   - Python: 3.12.4

2. **Build Configuration:**
   ```bash
   set TORCH_CUDA_ARCH_LIST=8.0;8.6;9.0;10.0;12.0
   set CUDA_HOME=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8
   ```
   - The `12.0` in TORCH_CUDA_ARCH_LIST enables sm_120 support

3. **Build Command:**
   ```bash
   python setup.py develop
   ```

### Issues Encountered

1. **Incomplete Build:**
   - Previous build attempt (see `pytorchbuild.txt`) stopped due to Avira antivirus blocking CMake test executables
   - Build was cleaned and ready to restart but never completed
   - Source location: `C:\Users\steve\Coding\pytorch`

2. **DLL Loading Failures:**
   - Attempted to test incomplete build
   - Error: `OSError: [WinError 126] The specified module could not be found. Error loading "C:\Users\steve\Coding\pytorch\torch\lib\aoti_custom_ops.dll" or one of its dependencies.`
   - Root cause: Build never finished, DLL dependencies incomplete

3. **Build Artifacts Exist But Incomplete:**
   - DLLs present in: `C:\Users\steve\Coding\pytorch\build\bin`
   - Import paths configured via: `.venv-sm120\Lib\site-packages\pytorch-dev.pth`
   - Cannot load due to missing dependencies from incomplete build

## Current State

### Working Environment (DO NOT MODIFY)
- **Branch:** `Updating-UI`
- **Venv:** `.venv`
- **PyTorch:** 2.8.0+cpu
- **Status:** ✅ Fully functional, training works

### Experimental Environment
- **Branch:** `test-sm120-pytorch`
- **Venv:** `.venv-sm120`
- **PyTorch:** Incomplete build at `C:\Users\steve\Coding\pytorch`
- **Status:** ⏸️ Build not finished

### Backup
- **Venv Backup:** `.venv.backup-cpu` (copy of working environment)

## Rollback Instructions

To return to working CPU PyTorch environment:

```bash
# Switch back to working branch
git checkout Updating-UI

# The original .venv is untouched and ready to use
# Verify it works:
python -c "import torch; print(torch.__version__); print('Working!')"
```

## To Complete the Build (Optional)

If you want to finish the PyTorch build for sm_120 testing:

1. **Open:** x64 Native Tools Command Prompt for VS 2022
2. **Navigate to:** `C:\Users\steve\Coding\pytorch`
3. **Run:**
   ```bash
   cd C:\Users\steve\Coding\pytorch
   set TORCH_CUDA_ARCH_LIST=8.0;8.6;9.0;10.0;12.0
   set CUDA_HOME=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8
   python setup.py clean
   python setup.py develop
   ```
4. **Time:** 1-3 hours
5. **After completion:** Test with `test_pytorch_sm120.py`

## Test Script

Created: `test_pytorch_sm120.py`
- Configures PATH for DLL loading from build directories
- Tests CUDA availability
- Verifies sm_120 compute capability
- Runs simple GPU tensor operations

## Recommendations

**Recommended Action:** Wait for official PyTorch sm_120 support

**Reasoning:**
1. CPU training is working perfectly
2. Build process requires 1-3 hours with no guarantee of success
3. RTX 5080 is very new (Jan 2025 release)
4. Official PyTorch support likely coming in next release (PyTorch 2.6+)
5. Community wheels may become available soon

**When to Revisit:**
- PyTorch 2.6+ release notes mention sm_120
- Community reports successful RTX 5080 builds
- NVIDIA releases official guidance
- Training performance becomes a bottleneck

## Files Created/Modified

**New Files:**
- `test_pytorch_sm120.py` - Test script for sm_120 PyTorch
- `.venv-sm120/` - Isolated test environment
- `.venv.backup-cpu/` - Backup of working environment
- `SM120_EXPERIMENT.md` - This document

**Modified:**
- None (all changes isolated to experimental branch)

**External:**
- `C:\Users\steve\Coding\pytorch\` - Incomplete PyTorch build (safe to delete)

## Cleanup (Optional)

To reclaim disk space after abandoning this experiment:

```bash
# Delete incomplete PyTorch build (saves ~10-15 GB)
rmdir /s "C:\Users\steve\Coding\pytorch"

# Delete experimental venv (saves ~2 GB)
rmdir /s .venv-sm120

# Delete backup venv if confident in main venv
rmdir /s .venv.backup-cpu

# Delete test script
del test_pytorch_sm120.py

# Switch back to main branch
git checkout Updating-UI

# Delete experimental branch
git branch -D test-sm120-pytorch
```

## Lessons Learned

1. **PyTorch Windows builds are complex** - Requires specific toolchain, long build times
2. **Editable installs have DLL issues** - `setup.py develop` creates DLL loading problems on Windows
3. **Antivirus interference** - Build tools trigger false positives
4. **Build must complete** - Partial builds create non-functional installations
5. **Isolation is key** - Experimental branch + separate venv prevented breaking working setup

## References

- Build notes: `pytorchbuild.txt`
- PyTorch from source: https://github.com/pytorch/pytorch#from-source
- CUDA compute capabilities: https://developer.nvidia.com/cuda-gpus
- RTX 5080 specs: Compute Capability 12.0 (sm_120)
