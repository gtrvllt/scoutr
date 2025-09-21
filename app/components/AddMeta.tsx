"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchTags } from "@/lib/data";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import AsyncCreatableSelect from 'react-select/async-creatable';

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
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    const newImage = imageFile ? renameImage(imageFile) : null;
    setFormData((prevData) => ({
      ...prevData,
      file: newImage,
    }));

    if (newImage) {
      setPreview(URL.createObjectURL(newImage));
    } else {
      setPreview(null);
    }
  };

  const onPasteFile = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    const imageFile = items[0].getAsFile();
    const newImage = imageFile ? renameImage(imageFile) : null;
    if (newImage && imageFile?.type.startsWith('image/')) {
      const t = URL.createObjectURL(newImage);
      setPreview(t);
      setFormData((d) => ({
        ...d,
        file: newImage,
      }));
    } else {
      alert("Please paste a valid image URL (jpg, png, jpeg).");
    }
  };

  const renameImage = (imageFile: File) => {
    const uniqueId = uuidv4();
    const uniqueFileName = `${uniqueId}_${imageFile.name}`;
    const renamedFile = new File([imageFile], uniqueFileName, {
      type: imageFile.type,
    });
    return renamedFile;
  };

  const onMetaAdded = () => {
    onMetaAddedCallBack();
    setFormData({
      name: "",
      description: "",
      tags: [],
      file: null,
    });
    setPreview(null);
    setSelectedTags([]);
  };

  const addMetaClick = async () => {
    setCreatingMeta(!creatingMeta);
    if (creatingMeta && formData.file !== null) {
      const res = await createMeta(formData);
      if (!res.error) {
        onMetaAdded();
      }
      setCreatingMeta(false);
    }
  };

  const uploadImage = async (file: File) => {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`public/${sanitizedFileName}`, file);
    if (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      return null;
    }
    return data.path;
  };

  const getPublicUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const res = supabase.storage
      .from('images')
      .getPublicUrl(imagePath);
    return res.data.publicUrl;
  };

  const createMeta = async (data: {
    name: string;
    description: string;
    tags: string[];
    file: File | null;
  }) => {
    const imagePath = data.file ? await uploadImage(data.file) : null;
    const imageUrl = getPublicUrl(imagePath);
    return await insertMeta(data, imageUrl, selectedTags);
  };

  const insertMeta = async (metaData: {
    name: string;
    description: string;
    tags: string[];
  }, imagePath: string | null, selectedTags: string[]) => {
    return await supabase
      .from("metas")
      .insert([
        {
          name: metaData.name,
          description: metaData.description,
          tags: selectedTags,
          user_id: "fb7a25b6-d374-4d91-a658-2d8f4f9c90f1",
          country_code: country.code,
          image_url: imagePath,
        },
      ])
      .select();
  };

  const createTag = async (name: string) => {
    console.log("Création du tag :", name);
    const { error } = await supabase
      .from("meta_tags")
      .insert({ name, country_code: country.code, created_at: new Date() });

    if (error) {
      console.error("Erreur lors de la création du tag :", error);
      return false;
    }

    setSelectedTags((prev) => [...prev, name]);
    return true;
  };

  const onTagInputChange = (newValue: { label: string; value: string }[]) => {
    const tags = newValue.map((tag) => tag.value);
    setSelectedTags(tags);
  }
  const loadTags = async (inputValue: string) => {
    console.log("Chargement des tags avec inputValue :", inputValue);
    const tags  = await fetchTags();
    console.log("Chargement des tags :", tags);
    return tags?.map((tag) => ({
      label: tag.name,
      value: tag.name,
    })) || [];
  };

  return (
    <div className="add-meta-container">
      {creatingMeta && (
        <div className="add-meta-form flex mb-4">
          <div className="image-container p-4 m-5">
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
                    style={{ display: "none" }}
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
                    onPaste={onPasteFile}
                    className="paste-image-input border-none"
                  />
                </div>
              </div>
            ) : (
              <Image src={preview} alt="metaImage" height={200} width={250} className="max-h-full object-cover" />
            )}
          </div>
          <div className="meta-inputs m-5 flex flex-col w-full">
            <div className="flex w-full space-x-2">
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                name="name"
                className="meta-name-input border-none w-1/2 px-3 py-2"
              />
              {/* <div className="tags-container flex flex-wrap w-1/2">
                {selectedTags.map((tag, index) => (
                  <span key={index} className="tag-item bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2">
                    {tag.trim()}
                  </span>
                ))}
              </div> */}
              <AsyncCreatableSelect
                classNamePrefix="custom-select"
                isMulti
                isClearable
                placeholder="Tags..."
                value={selectedTags.map((tag) => ({ label: tag, value: tag }))}
                onChange={onTagInputChange}
                onCreateOption={(inputValue) => {
                  const trimmed = inputValue.trim();
                  if (trimmed && !selectedTags.includes(trimmed)) {
                    createTag(trimmed);
                  }
                }}
                loadOptions={loadTags}
                defaultOptions
                cacheOptions
                className="w-full"
                aria-label="tag-selection"
              />
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
    </div>
  );
};

export default AddMeta;
