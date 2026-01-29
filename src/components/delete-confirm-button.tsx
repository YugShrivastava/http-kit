"use client";

import { useState } from "react";

interface DeleteConfirmButtonProps {
  itemType: string;
  itemName: string;
  action: (userId: string, formData: FormData) => Promise<{ error: boolean | string }>;
  userId: string;
  formData: Record<string, string>;
}

export function DeleteConfirmButton({
  itemType,
  itemName,
  action,
  userId,
  formData,
}: DeleteConfirmButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete this ${itemType}?\n\n${itemName}\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    await action(userId, fd);
    setIsDeleting(false);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs text-destructive hover:underline disabled:opacity-50"
    >
      {isDeleting ? `Deleting ${itemType}...` : `Delete entire ${itemType}`}
    </button>
  );
}