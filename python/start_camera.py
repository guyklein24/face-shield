import os
import cv2
import face_recognition
import time
import json
import argparse
import numpy as np

def load_watchlist(watchlist_folder):
    watchlist = {}

    # Iterate over files in the watchlist folder
    for filename in os.listdir(watchlist_folder):
        # Assuming the filename format is "suspect_name.jpg"
        suspect_name = os.path.splitext(filename)[0]

        # Load and encode the face
        encoding_path = os.path.join(watchlist_folder, filename)
        
        with open(encoding_path) as file:
            encoding = file.read()

        encoding = np.array(json.loads(encoding))

        # Store the encoding along with the suspect name
        watchlist[suspect_name] = encoding

    return watchlist

def main(camera_name, rtsp_url):
    # Load the watchlist
    watchlist_folder = 'watchlist/subject_encodings'
    watchlist = load_watchlist(watchlist_folder)

    # Determine which camera source to use
    if rtsp_url is not None:
        video_capture = cv2.VideoCapture(rtsp_url)
    else:
        video_capture = cv2.VideoCapture(0)  # Use default camera

    last_frame_recognized_persons = {}

    last_modified_time = os.path.getmtime(watchlist_folder)


    while True:
# Check if the directory has been modified
        current_modified_time = os.path.getmtime(watchlist_folder)

        if current_modified_time != last_modified_time:
            watchlist = load_watchlist(watchlist_folder)
            last_modified_time = current_modified_time

        # Capture frame-by-frame
        ret, frame = video_capture.read()

        # Find all face locations and face encodings in the current frame
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)

        # Create a set to keep track of detected persons in the current frame
        current_frame_recognized_persons = {}

        # Loop through each face in the frame
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            # Check if the face matches any face in the watchlist
            matches = face_recognition.compare_faces(list(watchlist.values()), face_encoding)

            # If a match is found, draw a red border and add text
            if True in matches:
                # Draw a red border around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Add text "Unauthorized" under the border
                cv2.putText(frame, "Unauthorized", (left + 6, bottom + 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                # Find the matching suspect name
                matching_suspects = [name for name, match in zip(watchlist.keys(), matches) if match]

                # Add suspect name at the top
                cv2.putText(frame, f"Suspect: {', '.join(matching_suspects)}", (left + 6, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                # Check if the person was detected in the last frame
                if matching_suspects[0] not in last_frame_recognized_persons:
                    alert = {
                        "subjectName": matching_suspects[0],
                        "timestamp": time.time(),
                        "cameraName": camera_name if camera_name is not None else "Built-in Camera"
                    }

                    print(json.dumps(alert), flush=True)

                # Update the last frame where the person was detected
                last_frame_recognized_persons[matching_suspects[0]] = time.time()

                # Add the person to the set of detected persons in the current frame
                current_frame_recognized_persons[matching_suspects[0]] = time.time()

            else:
                # Draw a green border around the face for non-matching faces
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        # Update the set of detected persons in the last frame
        last_frame_recognized_persons = current_frame_recognized_persons

        # Display the resulting frame
        cv2.imshow(camera_name if camera_name is not None else "Built-in Camera", frame)

        # Break the loop ifq 'q' key is pressed
        if cv2.waitKey(30) & 0xFF == ord('q'):
            break

    # Release the camera and close the OpenCV window
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--camera-name', type=str, help='Name of the camera')
    parser.add_argument('--rtsp-url', type=str, help='RTSP URL for IP camera')
    args = parser.parse_args()
    main(args.camera_name, args.rtsp_url)
