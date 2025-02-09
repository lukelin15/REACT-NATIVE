import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const StreetViewScreen = () => {
  const streetViewHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Expo RN Google Maps</title>
      <style>
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #map {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .toggleBtn {
          position: absolute;
          top: 15px;
          left: 20px;
          z-index: 999;
          background-color: white;
          padding: 10px 20px;
          font-size: 16px; 
          font-family: sans-serif;
          border: 2px solid #ccc;
          border-radius: 4px;
          margin: 10px; 
        }
      </style>
      <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBln4Zd0pJd6AkW3ADYabEffS_VIau3waA&callback=initMap"
        async
        defer
      ></script>
      <script>
        let map, panorama, toggleButton;

        function initMap() {
          const fenway = { lat: 32.8812, lng: -117.2344};

          map = new google.maps.Map(document.getElementById("map"), {
            center: fenway,
            zoom: 14,
            streetViewControl: true
          });

          panorama = map.getStreetView();
          panorama.setPosition(fenway);
          panorama.setPov({ heading: 34, pitch: 10 });

          toggleButton = document.createElement("div");
          toggleButton.className = "toggleBtn";
          toggleButton.innerText = "Enter Street View";
      
          toggleButton.onclick = () => {
            panorama.setVisible(!panorama.getVisible());
          };
      
          google.maps.event.addListener(panorama, "visible_changed", () => {
            if (panorama.getVisible()) {
              toggleButton.innerText = "Exit Street View";
            } else {
              toggleButton.innerText = "Enter Street View";
            }
          });
      
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(toggleButton);
        }
      </script>
    </head>
    <body>
      <div id="map"></div>
    </body>
  </html>
`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: streetViewHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

export default StreetViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webview: {
    flex: 1
  },
});
