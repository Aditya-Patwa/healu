import os, pickle

for d in os.listdir('.'):
    if os.path.isdir(d) and d not in ['.git', '.vscode', '.idea', '__pycache__']:
        for f in os.listdir(d):
            if f.endswith('.pkl'):
                path = os.path.join(d, f)
                try:
                    with open(path, 'rb') as file:
                        model = pickle.load(file)
                        features = getattr(model, 'feature_names_in_', None)
                        if features is not None:
                            print(f"{path}: Yes ({len(features)} features) -> {list(features)}")
                        else:
                            print(f"{path}: No")
                except Exception as e:
                    print(f"{path}: Failed to load ({e})")
