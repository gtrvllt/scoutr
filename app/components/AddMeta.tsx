"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

const AddMeta = () => {
  const [creatingMeta, setCreatingMeta] = useState(false);
  // metadata
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  // metadata
  const addMetaClick = () => {
    // prmier click : ouvrir le formulaire en setant creatingmeta à true
    // deuxieme click : on vérifie que les champs sont remplis et on envoie la requete, puis on ferme le formulaire en setant creatingmeta à false
    setCreatingMeta(!creatingMeta);
  };

  const createMeta = async (metaData: {
    name: string;
    description: string;
    type: string;
  }) => {
    // envoyer la requete

    const response = await supabase
      .from("metas")
      .insert([
        {
          name: metaData.name,
          description: metaData.description,
          type: metaData.type,
          user_id: "fb7a25b6-d374-4d91-a658-2d8f4f9c90f1",
          country_codes: ('["FR"]'),
        },
      ])
      .select();
  };
  return (
    <div className="add-meta-container">
      {creatingMeta && (
        <div className="add-meta-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="meta-name-input"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="meta-description-input"
          />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            className="meta-description-input"
          />
          <button
            className="save-meta-button"
            onClick={() => createMeta({ name, description, type })}
          >
            Save
          </button>
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
