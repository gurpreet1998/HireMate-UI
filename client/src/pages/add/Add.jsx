import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};

    // Check if the required fields are empty
    if (!state.title) {
      validationErrors.title = "Title is required";
    }
    if (!state.cat) {
      validationErrors.cat = "Category is required";
    }
    if (!state.cover) {
      validationErrors.cover = "Cover image is required";
    }
    if (!state.desc) {
      validationErrors.desc = "Description is required";
    }
    if (!state.shortTitle) {
      validationErrors.shortTitle = "Service title is required";
    }
    if (!state.shortDesc) {
      validationErrors.shortDesc = "Short description is required";
    }
    if (!state.deliveryTime) {
      validationErrors.deliveryTime = "Delivery time is required";
    }
    if (!state.revisionNumber) {
      validationErrors.revisionNumber = "Revision number is required";
    }
    if (!state.price) {
      validationErrors.price = "Price is required";
    }

    // Return the validation errors
    return validationErrors;
  };

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    mutation.mutate(state);
    setIsToastVisible(true);
    toast.success("Gig has been added!");
    navigate("/mygigs");
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
            <label htmlFor="">Category</label>
            <select
              className={errors.title ? "error" : ""}
              name="cat"
              id="cat"
              onChange={handleChange}
            >
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            {errors.cat && <div className="error-message">{errors.cat}</div>}
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                {errors.cover && (
                  <div className="error-message">{errors.cover}</div>
                )}
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              className={errors.title ? "error" : ""}
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            {errors.desc && <div className="error-message">{errors.desc}</div>}
            <button onClick={handleSubmit}>Create</button>
          </div>
          {isToastVisible && <ToastContainer />}
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.shortTitle && (
              <div className="error-message">{errors.shortTitle}</div>
            )}
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              className={errors.title ? "error" : ""}
            ></textarea>
            {errors.shortDesc && (
              <div className="error-message">{errors.shortDesc}</div>
            )}

            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input
              className={errors.title ? "error" : ""}
              type="number"
              name="deliveryTime"
              onChange={handleChange}
            />
            {errors.deliveryTime && (
              <div className="error-message">{errors.deliveryTime}</div>
            )}

            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.revisionNumber && (
              <div className="error-message">{errors.revisionNumber}</div>
            )}

            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input
              className={errors.title ? "error" : ""}
              type="number"
              onChange={handleChange}
              name="price"
            />
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
