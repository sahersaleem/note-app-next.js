"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FilePenIcon, TrashIcon } from "lucide-react";
type Notes = {
  id: number;
  content: string;
  description: string;
};

const defaultNotes: Notes[] = [
  {
    id: 1,
    content: "content 1",
    description: "description 1",
  },
  {
    id: 2,
    content: "content 2",
    description: "description 2",
  },
  {
    id: 3,
    content: "content 3",
    description: "description 3",
  },
];

function useLocalStorage<T>(key: string, intialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(intialValue);

  useEffect(() => {
    if (typeof window !== undefined) {
      try {
        const getItem = localStorage.getItem(key);
        if (getItem) {
          setStoredValue(JSON.parse(getItem));
        }
      } catch (err: any) {
        console.log("error occurred while getting items",err);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    try {
      if (typeof window !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (err: any) {
      console.log("Error ocurred while setting item!");
    }
  };

  return [storedValue, setValue] as const;
}

const NotesTokerApp = () => {
  const [notes, setNotes] = useLocalStorage<Notes[]>("notes", defaultNotes);

  const [newNotes, setNewNotes] = useState<{
    content: string;
    description: string;
  }>({
    content: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [ismounted, setisMounted] = useState<boolean>(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  const handleAddNote = () => {
    console.log("jbfhb")
    if (newNotes.content.trim() && newNotes.description.trim()) {
      const notesById = { id: Date.now(), ...newNotes };
      setNotes([...notes, notesById]);
      setNewNotes({ content: "", description: "" });
    }
  };

  const handleEditNotes = (id: number) => {
    const notesToEdit = notes.find((id) => id == id);

    if (notesToEdit) {
      setNewNotes({
        content: notesToEdit.content,
        description: notesToEdit.description,
      });
      setEditingId(id);
    }
  };

  const handleUpdateNotes = () => {
    if (newNotes.content.trim() && newNotes.description.trim()) {
      notes.map((item) =>
        item.id === editingId
          ? {
              id: item.id,
              content: item.content,
              description: item.description,
            }
          : notes
      );
      setNewNotes({ content: "", description: "" });
      setEditingId(null);
    }
  };

  const handleDelete = (id: number) => {
    const filterNotes = notes.filter((item) => item.id !== id);
    setNotes(filterNotes);
  };

  if (!ismounted) {
    return null;
  }

  return (
    <>
      <header className="w-full bg-black text-white py-4 px-2">
        <h1 className="text-4xl"> Note App </h1>
      </header>
      <div className="px-2 pt-6 space-y-4">
        <Input placeholder="Enter title" value={newNotes.content || ""} 
        onChange={(e)=>{setNewNotes({...newNotes , content:e.target.value})}}
        className="rounded-lg shadow-lg"
        />
        <Textarea placeholder="Enter description here" value={newNotes.description||""}  onChange={(e)=>{setNewNotes({...newNotes , description:e.target.value})}} className="rounded-lg shadow-lg"></Textarea>
      {
        editingId===null?(
            <Button onClick={handleAddNote}>Add notes</Button>
        ):(
            <Button onClick={handleUpdateNotes}>Update notes</Button>
        )
      }


      {
        notes.map((item)=>(
            <div key={item.id} className="px-3 py-6 bg-slate-50 shadow-lg flex justify-between rounded-lg">
              <div>
                <h1 className="font-bold">{item.content}</h1>
                <p>{item.description}</p>
                </div>

                <div className="flex gap-x-4">
                  <button onClick={()=>{handleDelete(item.id)}}><TrashIcon/></button>
                  <button onClick={()=>{handleEditNotes(item.id)}}><FilePenIcon/></button>



                </div>


            </div>
        ))
      }
      </div>
    </>
  );
};

export default NotesTokerApp;
