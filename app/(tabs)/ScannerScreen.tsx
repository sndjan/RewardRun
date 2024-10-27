import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";

function ScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (data) {
      setScanned(true);
      setResult(data);
    }
  };

  const handleResult = () => {
    if (!result) return null;

    if (result.startsWith("http")) {
      return (
        <Link style={styles.resultlink} href={"/(tabs)/two"}>
          {result}
        </Link>
      );
    } else {
      return <Text style={styles.resulttext}>{result}</Text>;
    }
  };

  return (
    <>
      <View style={styles.camerabox}>
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        )}
      </View>
      <View style={styles.textbox}>{handleResult()}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camerabox: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  resultlink: {
    color: "blue",
    flexWrap: "wrap",
    fontFamily: "monospace",
    padding: 20,
    textDecorationLine: "underline",
  },
  resulttext: {
    color: "white",
    flexWrap: "wrap",
    fontFamily: "monospace",
    padding: 20,
  },
  textbox: {
    borderTopColor: "blue",
    borderTopWidth: 3,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default ScannerScreen;
