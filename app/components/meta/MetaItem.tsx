"use client";
import "@/ui/global.css";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchTags } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";
import AsyncCreatableSelect from "react-select/async-creatable";
import type { MultiValue, ActionMeta } from "react-select";
import Image from "next/image";
import EditIcon from "@/ui/icons/edit.svg";
import TrashIcon from "@/ui/icons/trash.svg";
import EditHoverIcon from "@/ui/icons/editHover.svg";
import TrashHoverIcon from "@/ui/icons/trashHover.svg";

export interface MetaProps {
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

const MetaItem = ({ meta }: { meta: MetaProps }) => {
  const capitalizeFirst = (s: string) => {
    if (!s) return s;
    return s.charAt(0).toLocaleUpperCase() + s.slice(1);
  };

  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditHover, setIsEditHover] = useState(false);
  const [isTrashHover, setIsTrashHover] = useState(false);
  const [currentMeta, setCurrentMeta] = useState<MetaProps>(meta);
  let tags: string[] = [];

  if (Array.isArray(meta.tags)) {
    tags = meta.tags;
  } else if (typeof meta.tags === 'string') {
    try {
      const parsed = JSON.parse(meta.tags);
      tags = Array.isArray(parsed) ? parsed : [meta.tags];
    } catch {
      // Si c'est juste une string simple non JSON
      tags = [meta.tags];
    }
  }

  // State pour l'édition
  const initialTags: string[] = tags;
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    tags: string[];
    file: File | null;
  }>({
    name: currentMeta.name,
    description: currentMeta.description,
    tags: initialTags,
    file: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renameImage = (imageFile: File) => {
    const uniqueId = uuidv4();
    const uniqueFileName = `${uniqueId}_${imageFile.name}`;
    const renamedFile = new File([imageFile], uniqueFileName, {
      type: imageFile.type,
    });
    return renamedFile;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    const newImage = imageFile ? renameImage(imageFile) : null;
    setFormData((prev) => ({ ...prev, file: newImage }));
    if (newImage) setPreview(URL.createObjectURL(newImage));
    else setPreview(null);
  };

  const onPasteFile = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    const imageFile = items[0]?.getAsFile();
    const newImage = imageFile ? renameImage(imageFile) : null;
    if (newImage && imageFile?.type.startsWith("image/")) {
      const t = URL.createObjectURL(newImage);
      setPreview(t);
      setFormData((d) => ({ ...d, file: newImage }));
    } else {
      alert("Please paste a valid image URL (jpg, png, jpeg).");
    }
  };

  const uploadImage = async (file: File) => {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
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
    const res = supabase.storage.from("images").getPublicUrl(imagePath);
    return res.data.publicUrl;
  };

  const createTag = async (name: string) => {
    if (!currentMeta.country_code) {
      console.error("No country_code on meta; cannot create tag.");
      return false;
    }
    const { error } = await supabase
      .from("meta_tags")
      .insert({ name, country_code: currentMeta.country_code, created_at: new Date() });
    if (error) {
      console.error("Erreur lors de la création du tag :", error);
      return false;
    }
    setSelectedTags((prev) => [...prev, name]);
    return true;
  };

  const loadTags = async (inputValue: string) => {
    const tags = await fetchTags();
    return (
      tags?.
        filter((tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((tag) => ({ label: tag.name, value: tag.name })) || []
    );
  };

  const onTagInputChange = (
    newValue: MultiValue<{ label: string; value: string }>,
    _actionMeta: ActionMeta<{ label: string; value: string }>
  ) => {
    const tags = newValue.map((tag) => tag.value);
    setSelectedTags(tags);
  };

  const saveEdit = async () => {
    // Champs requis de base
    if (!formData.name || !formData.description) return;

    let nextImageUrl = currentMeta.image_url || null;
    if (formData.file) {
      const imagePath = await uploadImage(formData.file);
      nextImageUrl = getPublicUrl(imagePath);
    }

    const { data, error } = await supabase
      .from("metas")
      .update({
        name: formData.name,
        description: formData.description,
        tags: selectedTags,
        image_url: nextImageUrl,
      })
      .eq("id", currentMeta.id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour de la meta :", error);
      return;
    }

    // Actualise l'affichage localement
    const updated: MetaProps = {
      ...currentMeta,
      name: formData.name,
      description: formData.description,
      tags: selectedTags,
      image_url: nextImageUrl || undefined,
    };
    setCurrentMeta(updated);
    setIsEditing(false);
    setPreview(null);
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPreview(null);
    setFormData({
      name: currentMeta.name,
      description: currentMeta.description,
      tags: Array.isArray(currentMeta.tags) ? (currentMeta.tags as string[]) : initialTags,
      file: null,
    });
    setSelectedTags(initialTags);
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this item? This cannot be undone.");
    if (!ok) return;
    const { error } = await supabase
      .from("metas")
      .delete()
      .eq("id", currentMeta.id);
    if (error) {
      console.error("Erreur lors de la suppression de la meta :", error);
      return;
    }
    setIsDeleted(true);
  };

  if (isDeleted) return null;

  return (
    <div className="meta pt-4 mb-4 grid grid-cols-2 gap-4 relative">
      {/* Colonne gauche: image / upload */}
      <div className="meta-image-container">
        {/* {isEditing ? (
          <div className="p-2">
            {!preview ? (
              <div className="h-full">
                <div
                  className="file-input-container flex items-center justify-center"
                  onClick={() => document.getElementById(`file-upload-input-${currentMeta.id}`)?.click()}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    id={`file-upload-input-${currentMeta.id}`}
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div>Upload a new picture (optional)</div>
                </div>
                <div className="file-input-container flex items-center justify-center" style={{ height: "50%" }}>
                  <input
                    type="text"
                    placeholder="Or paste your image here"
                    onPaste={onPasteFile}
                    className="paste-image-input border rounded px-2 py-1 mt-2 w-full"
                  />
                </div>
                {currentMeta.image_url && (
                  <div className="text-xs text-gray-500 mt-2">Current image will be kept if you don't upload a new one.</div>
                )}
              </div>
            ) : (
              <img
                src={preview}
                alt="preview"
                className="max-h-full object-cover rounded"
              />
            )}
          </div>
        ) }*/
          currentMeta.image_url ? (
            <img
              src={currentMeta.image_url}
              alt={currentMeta.name}
              className="w-full h-auto object-cover w-full max-w-[500px] h-auto transition-transform duration-300 cursor-pointer"
              onClick={() => setIsImageZoomed(true)}
            />
          ) : (
            <div className="max-w-[500px] h-32 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
      </div>

      {/* Colonne droite: affichage ou édition */}
      <div>
        {!isEditing ? (
          <>
            {/* Header: title left, actions right */}
            <div className="meta-header flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold pr-5 truncate">{capitalizeFirst(currentMeta.name)}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Edit"
                  onClick={() => setIsEditing(true)}
                  onMouseEnter={() => setIsEditHover(true)}
                  onMouseLeave={() => setIsEditHover(false)}
                  title="Edit"
                >
                  <Image src={isEditHover ? EditHoverIcon : EditIcon} alt="Edit" className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={handleDelete}
                  onMouseEnter={() => setIsTrashHover(true)}
                  onMouseLeave={() => setIsTrashHover(false)}
                  title="Delete"
                >
                  <Image src={isTrashHover ? TrashHoverIcon : TrashIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Tags line below header */}
            <div className="tags flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag, index) => (
                <span key={index} className="inline-block text-black-200 text-xs font-light pr-2.5 py-0.5">
                  {tag.trim()}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-2">{currentMeta.description}</p>
          </>
        ) : (
          <div className="m-2 flex flex-col w-full">
            <div className="flex w-full space-x-2 items-start">
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                name="name"
                className="border rounded w-1/2 px-3 py-2"
              />
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
              className="border rounded w-full resize-none mt-2 p-2"
            />
            <div className="mt-3 flex gap-2">
              <button
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
                onClick={saveEdit}
                disabled={!formData.name || !formData.description}
              >
                Save
              </button>
              <button
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zoomed image modal */}
      {isImageZoomed && !isEditing && (
        <div
          className="fixed flex flex-col inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageZoomed(false)}
          onKeyDown={() => setIsImageZoomed(false)}
        >
          <div className="flex items-start flex-col">
            <h1 className="text-white pb-4">{currentMeta.name}</h1>
            <img
              src={currentMeta.image_url}
              alt={currentMeta.name}
              className="max-w-full max-h-full object-contain cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaItem;
