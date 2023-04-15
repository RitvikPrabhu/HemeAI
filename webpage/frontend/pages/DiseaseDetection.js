import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState } from "react";
import styles from "@/styles/DiseaseDetection.module.css";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios, { AxiosResponse } from "axios";
import JSZip from "jszip";

function DiseaseDetection() {
  const API_URL = "http://localhost:5000";

  const [images, setImages] = useState([]);
  const [uploadStage, setUploadStage] = useState(true);

  const [zipFile, setZipFile] = useState(null);
  const [imageResults, setImageResults] = useState([]);
  const [tableDate, setTableData] = useState({
    Platelets: "Loading...",
    RBC: "Loading...",
    WBC: "Loading...",
  });

  const handleUpload = (event) => {
    const uploadedImages = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const handleDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const downloadZip = () => {
    const url = URL.createObjectURL(new Blob([zipFile]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "processed_images.zip");
    link.style.display = "none"; // hide the link
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const processImages = () => {
    setUploadStage(false);
    axios
      .post(
        API_URL + "/images-disease",
        {
          images: images,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // add this option to indicate the expected response type
        }
      )
      .then((response) => {
        // create a URL for the blob object
        setZipFile(response.data);
        // unzip the file and extract all the images
        JSZip.loadAsync(response.data).then((zip) => {
          const imagePromises = Object.keys(zip.files).map((filename) => {
            return zip
              .file(filename)
              .async("blob")
              .then((blob) => {
                return URL.createObjectURL(blob);
              });
          });

          Promise.all(imagePromises).then((imageUrls) => {
            setImageResults(imageUrls);
            console.log(imageResults);
          });
        });
      })
      .catch((error) => {
        // handle errors here
      });

    axios
      .post(
        API_URL + "/metrics-disease",
        {
          images: images,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // access the response data here
        const resultsData = response.data;
        console.log("hey");
        console.log(resultsData);
        setTableData(resultsData);
      })
      .catch((error) => {
        // handle errors here
      });
  };

  const refreshPage = () => {
    location.reload();
  };

  return (
    <div className={styles.background}>
      <Header />
      <h1 className={styles.title}>Disease Detection</h1>
      {uploadStage ? (
        <div className={styles.main}>
          <div className={styles.buttonBox}>
            <Button
              variant="contained"
              component="label"
              className={styles.button}
            >
              {images.length === 0 ? "Upload Images" : "Add More Images"}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                hidden
                multiple
              />
            </Button>
            {images.length > 0 && (
              <Button
                variant="contained"
                component="label"
                className={styles.button}
                onClick={() => processImages()}
              >
                Process Images
              </Button>
            )}
          </div>

          <ImageList
            sx={{
              width: "80%",
              height: "80%",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
            cols={4}
          >
            {images.slice(0, 10).map((image, index) => (
              <ImageListItem
                key={index}
                sx={{
                  position: "relative",
                  "&:hover": {
                    filter: "brightness(80%)",
                  },
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`image-${index}`}
                  width={100}
                  height={100}
                  onClick={() => handleDelete(index)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.content}>
            <table
              style={{ borderCollapse: "collapse" }}
              className={styles.table}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Cell Type</th>
                  <th style={{ textAlign: "center" }}>Percentage</th>
                  <th style={{ textAlign: "center" }}>Normal Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Neutrophils
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="neutrophilVal"
                  >
                    {tableDate["neutrophils"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    0 - 1
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Eosinophils
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="eosinophilVal"
                  >
                    {tableDate["eosinophils"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    1 - 3
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Basophils
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="basophilVal"
                  >
                    {tableDate["basophils"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    0 - 1
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Lymphocytes
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="lymphocyteVal"
                  >
                    {tableDate["lymphocytes"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    20 - 40
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Monocytes
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="monocyteVal"
                  >
                    {tableDate["monocytes"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    4 - 8
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Myelocytes
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="myelocyteVal"
                  >
                    {tableDate["myelocytes"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    0
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Erythroblasts
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="erythroblastVal"
                  >
                    {tableDate["erythroblasts"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>...</td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Abnormal RBCs
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="abnormalRBCVal"
                  >
                    {tableDate["abnormal_rbc"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>...</td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Band Neutrophils
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="bandVal"
                  >
                    {tableDate["band_neutrophils"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    0 - 5
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Segmented Neutrophils
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="segVal"
                  >
                    {tableDate["segmented_neutrophils"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    40 - 60
                  </td>
                </tr>
              </tbody>
            </table>
            <ImageList
              sx={{
                width: "40vw",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
              cols={4}
            >
              {imageResults.slice(0, 10).map((image, index) => (
                <ImageListItem
                  key={index}
                  sx={{
                    position: "relative",
                    width: "90%",
                  }}
                >
                  <img
                    src={image} // use the render_url property here
                    alt={`image-${index}`}
                    width={100}
                    height={100}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
          <div>
            {zipFile && (
              <Button
                variant="contained"
                component="label"
                className={styles.button}
                onClick={() => downloadZip()}
              >
                Download Images
              </Button>
            )}
            <Button
              variant="contained"
              component="label"
              className={styles.button}
              onClick={() => refreshPage()}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default DiseaseDetection;
