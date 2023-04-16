import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState } from "react";
import styles from "@/styles/AutoCBC.module.css";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios, { AxiosResponse } from "axios";
import JSZip from "jszip";
import { useRouter } from "next/router";
import AbnormalResultsPopup from "@/components/Popup";

function AutoCBC() {
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
  const [showPopup, setShowPopup] = useState(false);
  const [abnormal, setAbnormal] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const router = useRouter();

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
        API_URL + "/images",
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
        API_URL + "/metrics",
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
        const RBC = parseFloat(resultsData["RBC"]);
        const WBC = parseFloat(resultsData["WBC"]);
        const Platelets = parseFloat(resultsData["Platelets"]);

        if (RBC > WBC && RBC > Platelets) {
          console.log("RBC is the highest");
          setShowPopup(true);
          setAbnormal(true);
        }
        setTableData(resultsData);

        //Check if the results are good or bad
      })
      .catch((error) => {
        // handle errors here
      });
  };

  const refreshPage = () => {
    location.reload();
  };
  function handleButtonClick(event) {
    console.log(typeof images);

    router.push({
      pathname: "/DiseaseDetection",
    });
  }

  return (
    <div className={styles.background}>
      <Header />
      <h1 className={styles.title}>AutoCBC</h1>
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
                  <td style={{ border: "none", textAlign: "center" }}>RBC</td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="rbcVal"
                  >
                    {tableDate["RBC"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    93 - 97
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>WBC</td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="wbcVal"
                  >
                    {tableDate["WBC"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>
                    0.5 - 2
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "center" }}>
                    Platelets
                  </td>
                  <td
                    style={{ border: "none", textAlign: "center" }}
                    id="plateletsVal"
                  >
                    {tableDate["Platelets"]}
                  </td>
                  <td style={{ border: "none", textAlign: "center" }}>1 - 3</td>
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
            {abnormal && (
              <Button
                variant="contained"
                component="label"
                className={styles.button}
                onClick={handleButtonClick}
                style={{ backgroundColor: "#006400" }}
              >
                Run Disease Detection
              </Button>
            )}
          </div>
        </div>
      )}
      <Footer />
      {showPopup && (
        <AbnormalResultsPopup
          title="Abnormal results"
          body="We detect something wrong with your blood test results. Please run
        Disease Detection."
          showButton={true}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export default AutoCBC;
