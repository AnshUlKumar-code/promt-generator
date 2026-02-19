import React, { useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const response = await axios.post(
        "https://promt-generator-six.vercel.app/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      alert("Post uploaded successfully!");

      setTitle("");
      setImage(null);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Post</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: "15px",
  },
  input: {
    padding: "10px",
  },
  button: {
    padding: "10px",
    cursor: "pointer",
  },
};

export default App;
