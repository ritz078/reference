import create from "zustand";

interface IMode {
  editMode: boolean;
  toggleEditMode: () => void;
}

const [useMode] = create<IMode>((set) => ({
  editMode: true,
  toggleEditMode: () =>
    set((state) => ({
      editMode: !state.editMode,
    })),
}));

export { useMode };
