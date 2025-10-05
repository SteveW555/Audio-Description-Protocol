"""
Test script for custom PyTorch build with sm_120 support
Handles the editable install from 'python setup.py develop'
"""
import os
import sys

# Key insight: The build from 'setup.py develop' puts DLLs in build/bin, not build/lib
# We need to add build/bin, torch/lib, and CUDA paths for DLL resolution
pytorch_root = r"C:\Users\steve\Coding\pytorch"
pytorch_torch_lib = os.path.join(pytorch_root, "torch", "lib")
pytorch_build_bin = os.path.join(pytorch_root, "build", "bin")  # Changed from build/lib!
pytorch_build_lib = os.path.join(pytorch_root, "build", "lib")

cuda_bin_12_8 = r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8\bin"
cuda_lib_12_8 = r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8\lib\x64"

# Add all necessary paths to PATH for DLL loading
paths_to_add = [
    pytorch_build_bin,  # DLLs are here!
    pytorch_torch_lib,
    pytorch_build_lib,
    cuda_bin_12_8,
    cuda_lib_12_8
]

# Prepend to PATH
os.environ["PATH"] = ";".join(paths_to_add) + ";" + os.environ.get("PATH", "")

print(f"Added to PATH:")
for p in paths_to_add:
    print(f"  - {p}")
print()

# Now try to import torch
try:
    import torch
    print("✓ PyTorch imported successfully")
    print(f"  Version: {torch.__version__}")
    print(f"  CUDA available: {torch.cuda.is_available()}")

    if torch.cuda.is_available():
        print(f"  CUDA version: {torch.version.cuda}")
        print(f"  cuDNN version: {torch.backends.cudnn.version()}")
        print(f"  Number of GPUs: {torch.cuda.device_count()}")

        if torch.cuda.device_count() > 0:
            print(f"  GPU 0: {torch.cuda.get_device_name(0)}")
            props = torch.cuda.get_device_properties(0)
            print(f"  Compute capability: {props.major}.{props.minor}")

            # Check if this is sm_120 (compute capability 12.0)
            if props.major == 12 and props.minor == 0:
                print("  ✓✓✓ sm_120 support confirmed! RTX 5080 detected!")
            else:
                print(f"  Compute capability is {props.major}.{props.minor}, not sm_120")

            # Try a simple tensor operation on GPU
            print("\n  Testing GPU tensor operations...")
            x = torch.randn(3, 3).cuda()
            y = torch.randn(3, 3).cuda()
            z = x @ y
            print(f"  ✓ Matrix multiplication on GPU successful")
            print(f"  Result shape: {z.shape}")
    else:
        print("  ⚠ CUDA not available")
        print("  This could mean:")
        print("    - Build was CPU-only")
        print("    - CUDA drivers not found")
        print("    - GPU not detected")

except Exception as e:
    print(f"✗ Error importing or testing PyTorch:")
    print(f"  {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
