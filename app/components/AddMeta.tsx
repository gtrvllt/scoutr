"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Autocomplete from "@/components/inputs/autocomplete";
import { fetchTags, addTag } from "@/lib/data";
import { v4 as uuidv4 } from 'uuid';

export interface MetaTag {
  id: string;
  user_id?: string;
  country_code?: string;
  tags: string[];
  name: string;
  description: string;
  image_url?: string;
  metadata?: Record<string, any>;
  add_date?: string;
  edit_date?: string;
  created_by?: string;
  updated_by?: string;
  original_id?: string;
}

type AddMetaProps = {
  country: {
    code: string;
    name: string;
  };
  onMetaAddedCallBack: () => void;
};

const AddMeta = ({ country, onMetaAddedCallBack }: AddMetaProps) => {
  const [creatingMeta, setCreatingMeta] = useState(false);
  // metadata
  // fetch les metas et les tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    tags: string[];
    file: File | null;
  }>({
    name: "",
    description: "",
    tags: [],
    file: null,
  });
  const [preview, setPreview] = useState<string | null>(null); // Stocke l'URL de prévisualisation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent) => {
    const imageFile = e.target.files[0];
    const newwImage = imageFile ? renameImage(imageFile) : null;
    setFormData((prevData) => ({
      ...prevData,
      file: newwImage,
    }));

    if (newwImage) {
      setPreview(URL.createObjectURL(newwImage));
    } else {
      setPreview(null);
    }
  };

  const onPasteFile = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    const imageFile = items[0].getAsFile()
    const newImage = imageFile ? renameImage(imageFile) : null;
    if (newImage && imageFile?.type.startsWith('image/')) {
      const t = URL.createObjectURL(newImage)
      setPreview(t);
      // setPreview(imageFile);
      setFormData((d) => ({
        ...d,
        file: newImage, // Reset file input since we're using a URL
      }));
    } else {
      alert("Please paste a valid image URL (jpg, png, jpeg).");
    }
  }

  const renameImage = (imageFile: File) => {
    // Générer un UUID
    const uniqueId = uuidv4();

    // Créer un nouveau nom de fichier en ajoutant l'UUID au nom original
    const uniqueFileName = `${uniqueId}_${imageFile.name}`;

    // Créer un nouvel objet File avec le nom unique
    const renamedFile = new File([imageFile], uniqueFileName, {
      type: imageFile.type,
    });

    return renamedFile;
  };

  const onMetaAdded = () => {
    onMetaAddedCallBack();
    // Reset form data and preview
    setFormData({
      name: "",
      description: "",
      tags: [],
      file: null,
    });
    setPreview(null);
    setSelectedTags([]);
  }
  const addMetaClick = async () => {
    // prmier click : ouvrir le formulaire en setant creatingmeta à true
    // deuxieme click : on vérifie que les champs sont remplis et on envoie la requete, puis on ferme le formulaire en setant creatingmeta à false
    setCreatingMeta(!creatingMeta);
    if (creatingMeta && formData.file !== null) {
      const res = await createMeta(formData);
      if (!res.error) {
        onMetaAdded();
      }
      setCreatingMeta(false);
    }
  };

  const onKeyDownTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Empêche le saut de ligne
      const newTag = (e.target as HTMLInputElement).value.trim();
      if (!selectedTags.includes(newTag)) {
        addTag(newTag).then((res) => {
          // selectedTags.push(newTag)
          setSelectedTags((prevTags) => [...prevTags, newTag]);
          formData.tags = []
        })
      }
      // if (!tags.includes(newTag)) {
      //   addTag(newTag).then((res) => {
      //     console.log("ABC addTag res", res)
      //     // setTags((prevTags) => [...prevTags, newTag]);
      //   }
      // } else {
      //   alert("Tag already exists");
      // }
    }
  };

  const uploadImage = async (file: File) => {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`public/${sanitizedFileName}`, file);
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
    // if (res.error) {
    //   console.error('Erreur lors de la récupération de l\'URL publique :', error);
    //   return null;
    // }

    return res.data.publicUrl;
  };

  const createMeta = async (data: {
    name: string;
    description: string;
    tags: string[];
    file: File | null;
  }) => {
    const imagePath = data.file ? await uploadImage(data.file) : null;
    const imageUrl = getPublicUrl(imagePath)
    // const res =  await insertMeta(data, imagePath)
    return await insertMeta(data, imageUrl, selectedTags)

  }


  const insertMeta = async (metaData: {
    name: string;
    description: string;
    tags: string[];
  }, imagePath: string | null, selectedTags: string[]) => {
    // envoyer la requete
    return await supabase
      .from("metas")
      .insert([
        {
          name: metaData.name,
          description: metaData.description,
          tags: selectedTags,
          user_id: "fb7a25b6-d374-4d91-a658-2d8f4f9c90f1", // current test user
          country_code: country.code,
          image_url: imagePath,
        },
      ])
      .select();
  };
  return (
    <div className="add-meta-container">
      {creatingMeta && (
        <div className="add-meta-form flex mb-4">
          <div className="image-container p-4">
            {/* {!formData.file ? ( */}
            {!preview ? (
              <div className="h-full">
                <div
                  className="file-input-container flex items-center justify-center h-1/2"
                  onClick={() => document.getElementById("file-upload-input")?.click()}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    style={{ marginRight: "10px", width: "0", height: "0" }}
                  />
                  <div>Upload your picture</div>
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5238 20.8095H2.19048V5.47619H12.0476V3.28571H2.19048C0.985714 3.28571 0 4.27143 0 5.47619V20.8095C0 22.0143 0.985714 23 2.19048 23H17.5238C18.7286 23 19.7143 22.0143 19.7143 20.8095V10.9524H17.5238V20.8095ZM8.99191 17.3376L6.84524 14.7529L3.83333 18.619H15.881L12.0038 13.4605L8.99191 17.3376ZM19.7143 3.28571V0H17.5238V3.28571H14.2381C14.249 3.29667 14.2381 5.47619 14.2381 5.47619H17.5238V8.75095C17.5348 8.7619 19.7143 8.75095 19.7143 8.75095V5.47619H23V3.28571H19.7143Z" fill="black" />
                  </svg>
                </div>
                <div
                  className="file-input-container flex items-center justify-center h-1/2"
                  style={{ height: "50%" }}
                >
                  <input
                    type="text"
                    placeholder="Or paste your image here"
                    onPaste={(e) => { onPasteFile(e); }}
                    className="paste-image-input border-none"
                  />
                </div>
              </div>
            ) : (
              <Image src={preview} alt="metaImage" height={200} width={250} className="max-h-full object-cover" />
            )}
          </div>
          <div className="meta-inputs flex flex-col w-full">
            <div className="flex w-full space-x-2">
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                name="name"
                className="meta-name-input border-none w-1/2 px-3 py-2"
              />
              <input
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Choose tags"
                name="tags"
                className="meta-tags-input border-none w-1/2 px-3 py-2"
                onKeyDown={onKeyDownTagInput}
              />
              {/* <Autocomplete
                suggestions={["Paris", "Lyon", "Marseille", "Toulouse"]}
                onSelect={(val) => setFormData({ ...formData, tags: val })}
                placeholder="Choose a city"
              /> */}
              <div className="tags-container flex flex-wrap">
                {selectedTags.map((tag, index) =>
                (
                  <span key={index} className="tag-item bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              name="description"
              className="meta-description-input border-none w-full resize-none"
            />

          </div>
        </div>
      )}
      {/* bouton ajout meta */}
      <button
        className="add-meta-button group disabled cursor-pointer bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300"
        onClick={addMetaClick}
        disabled={creatingMeta && (!formData.name || !formData.description || !formData.file)}>
        Add a meta
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2 text-black group-hover:text-white transition-all duration-300"
        >
          <path
            d="M10.5 0C4.989 0 0.5 4.489 0.5 10C0.5 15.511 4.989 20 10.5 20C16.011 20 20.5 15.511 20.5 10C20.5 4.489 16.011 0 10.5 0ZM10.5 2C14.9301 2 18.5 5.56988 18.5 10C18.5 14.4301 14.9301 18 10.5 18C6.06988 18 2.5 14.4301 2.5 10C2.5 5.56988 6.06988 2 10.5 2ZM9.5 5V9H5.5V11H9.5V15H11.5V11H15.5V9H11.5V5H9.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div >
  );
};

export default AddMeta;
