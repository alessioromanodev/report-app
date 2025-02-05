import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import "react-native-get-random-values";
import ReportModule from "./ReportModule";

interface PhotoData {
  uri: string;
  base64: string;
}

export default function App() {
  // States for permission, camera, photo, preview, and report
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showReportModule, setShowReportModule] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhotoData({
        uri: data.uri,
        base64: data.base64 ? data.base64 : "",
      });
      setCameraOpen(false);
      setShowPreview(true);
    }
  };

  // Handler when user decides to cancel the preview (using the X icon)
  const handleCancelPreview = () => {
    setPhotoData(null);
    setShowPreview(false);
  };

  // Handler to retake the photo
  const handleRetake = () => {
    setPhotoData(null);
    setShowPreview(false);
    setCameraOpen(true);
  };

  // Handler to confirm the photo and move to ReportModule
  const handleConfirm = () => {
    setShowPreview(false);
    setShowReportModule(true);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  // Show ReportModule when confirmed
  if (showReportModule && photoData) {
    return <ReportModule photoData={photoData} />;
  }

  // Show photo preview overlay if a photo has been taken and preview is active
  if (showPreview && photoData) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoData.uri }} style={styles.previewImage} />
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelPreview}
        >
          <Text style={styles.cancelButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show camera view when open
  if (cameraOpen) {
    return (
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  // Landing page with header and a big camera button in the center
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.userContainer}>
          <Image
            source={{
              uri: "https://californiamuseum.org/wp-content/uploads/Zuckerberg-Cropped-Black-and-White-Resized-scaled.jpg",
            }}
            style={styles.userPic}
          />
          <Text style={styles.userName}>Mark Zuckerberg</Text>
        </View>
        <View style={styles.starContainer}>
          <Image
            source={{
              uri: "https://img.icons8.com/ios-filled/50/ffffff/star--v1.png",
            }}
            style={styles.starIcon}
          />
          <Text style={styles.starText}>30</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.greeting}>
          Ciao Mark, cosa vorresti segnalare oggi?
        </Text>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => setCameraOpen(true)}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/ios-filled/100/ffffff/camera.png",
            }}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Landing page styles
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  starText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60, // extra spacing between greeting and button
  },
  cameraButton: {
    backgroundColor: "#007BFF",
    padding: 20,
    borderRadius: 100,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    tintColor: "#fff",
  },
  // Camera view styles
  camera: {
    flex: 1,
    width: "100%",
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },
  captureButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 50,
  },
  captureText: {
    fontSize: 18,
    color: "#000",
  },
  // Error page styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
  },
  // Photo preview overlay styles
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  cancelButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  previewButtons: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  retakeButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retakeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

