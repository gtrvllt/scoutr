"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const AddMeta = () => {
  const [creatingMeta, setCreatingMeta] = useState(false);
  // metadata
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: string;
    file: File | null; // 👈 Permet d'accepter un fichier ou null
  }>({
    name: "",
    description: "",
    type: "",
    file: null,
  });
  const [preview, setPreview] = useState<string | null>(null); // Stocke l'URL de prévisualisation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: file,
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const addMetaClick = () => {
    // prmier click : ouvrir le formulaire en setant creatingmeta à true
    // deuxieme click : on vérifie que les champs sont remplis et on envoie la requete, puis on ferme le formulaire en setant creatingmeta à false
    setCreatingMeta(!creatingMeta);
    if (creatingMeta && formData.file !== null) {
      createMeta(formData);
      setCreatingMeta(false);
    }
  };

  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`public/${file.name}`, file);
      // todo - gérer le nom du dossier
    if (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      return null;
    }
    return data.path;
  };

  const getPublicUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    // const { publicURL, error } = supabase.storage
    const res = supabase.storage
      .from('images')
      .getPublicUrl(imagePath);
    console.log('ABC getPublicUrl res', res)
    // if (res.error) {
    //   console.error('Erreur lors de la récupération de l\'URL publique :', error);
    //   return null;
    // }
  
    return res.data.publicUrl;
  };

  const createMeta = async (data: {
    name: string;
    description: string;
    type: string;
    file: File;
  }) => {
    const imagePath = await uploadImage(data.file);
    const imageUrl = getPublicUrl(imagePath)
    // const res =  await insertMeta(data, imagePath)
    const res =  await insertMeta(data, imageUrl)
  }


  const insertMeta = async (metaData: {
    name: string;
    description: string;
    type: string;
  }, imagePath: string | null) => {
    // envoyer la requete

    const response = await supabase
      .from("metas")
      .insert([
        {
          name: metaData.name,
          description: metaData.description,
          type: metaData.type,
          user_id: "fb7a25b6-d374-4d91-a658-2d8f4f9c90f1", // current test user
          country_codes: '["FR"]',
          image_url: imagePath,
        },
      ])
      .select();
  };
  return (
    <div className="add-meta-container">
      {creatingMeta && (
        <div className="add-meta-formf flex">
          <div className="image-container">
            {/* {!formData.file ? ( */}
            {!preview ? (
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                style={{ marginRight: "10px" }}
              />
            ) : (
              <Image src={preview} alt="metaImage" height={200} width={250} />
            )}
          </div>
          <div className="meta-inputs flex flex-col">
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              name="name"
              className="meta-name-input"
            />
            <input
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              name="description"
              className="meta-description-input"
            />
            <input
              type="text"
              value={formData.type}
              onChange={handleChange}
              placeholder="Type"
              name="type"
              className="meta-description-input"
            />
            {/* <button
            className="save-meta-button"
            onClick={() => createMeta({ name, description, type })}
            >
            Save
            </button> */}
          </div>
        </div>
      )}
      {/* bouton ajout meta */}
      <button className="add-meta-button disabled" onClick={addMetaClick}>
        Add a meta
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 0C4.989 0 0.5 4.489 0.5 10C0.5 15.511 4.989 20 10.5 20C16.011 20 20.5 15.511 20.5 10C20.5 4.489 16.011 0 10.5 0ZM10.5 2C14.9301 2 18.5 5.56988 18.5 10C18.5 14.4301 14.9301 18 10.5 18C6.06988 18 2.5 14.4301 2.5 10C2.5 5.56988 6.06988 2 10.5 2ZM9.5 5V9H5.5V11H9.5V15H11.5V11H15.5V9H11.5V5H9.5Z"
            fill="black"
          />
        </svg>
      </button>
    </div>
  );
};

export default AddMeta;
