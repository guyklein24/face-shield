import os
import face_recognition
import json
import argparse

def extract_features_from_image(image_path):

    # Assuming the filename format is "suspect_name.jpg"
    subject_name = os.path.basename(os.path.splitext(image_path)[0])

    # Load and encode the face
    image = face_recognition.load_image_file(image_path)
    face_encodings = face_recognition.face_encodings(image)[0]

    return { 
        "name": subject_name,
        "encoding": json.dumps(face_encodings.tolist())
    }

def main(image_path):
    # Load the watchlist
    watchlist_folder = 'watchlist/subject_images'
    subject_encodings = extract_features_from_image(os.path.join(watchlist_folder, image_path))
    print(json.dumps(subject_encodings), flush=True)


    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--image-path', type=str, help='Path to subject image')
    args = parser.parse_args()
    main(args.image_path)
