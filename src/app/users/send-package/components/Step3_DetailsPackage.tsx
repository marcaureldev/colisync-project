"use client";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { PackageItem, PackageType } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, PackageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // Pour générer des IDs uniques

interface Step3Props {
  data: PackageItem[];
  updateData: (newPackages: PackageItem[]) => void;
}

export interface Step3Ref {
  validateForm: () => boolean;
}

const initialModalPackageState: Omit<PackageItem, "id"> = {
  description: "",
  quantity: "1",
  weight: "",
  packageType: "standard",
  // value: "",
  imageFile: null,
};

const packageTypeOptions: { value: PackageType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "large", label: "Large" },
  { value: "express", label: "Express" },
];

const Step3_PackageDetails = forwardRef<Step3Ref, Step3Props>(
  ({ data: packages, updateData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageItem | null>(
      null
    );
    const [modalFormData, setModalFormData] = useState<Omit<PackageItem, "id">>(
      initialModalPackageState
    );
    const [modalErrors, setModalErrors] = useState<
      Partial<Record<keyof Omit<PackageItem, "id">, string>>
    >({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
      if (isModalOpen) {
        if (editingPackage) {
          setModalFormData({
            description: editingPackage.description,
            quantity: editingPackage.quantity,
            weight: editingPackage.weight,
            packageType: editingPackage.packageType,
            // value: editingPackage.value,
            imageFile: editingPackage.imageFile || null,
          });

          // Générer l'aperçu si une image existe déjà pour le colis en édition
          if (editingPackage.imageFile) {
            setImagePreview(URL.createObjectURL(editingPackage.imageFile));
          } else {
            setImagePreview(null);
          }
        } else {
          setModalFormData(initialModalPackageState);
          setImagePreview(null); 
        }
        setModalErrors({});
      } else {
        // Nettoyer l'URL de l'objet quand le modal est fermé pour libérer la mémoire
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
      }
    }, [isModalOpen, editingPackage]);

    // S'assurer de nettoyer l'URL de l'objet lors du démontage du composant
    useEffect(() => {
      return () => {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    }, [imagePreview]);

    const handleModalInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;
      if (type === "file") {
        const file = (e.target as HTMLInputElement).files?.[0] || null;
        setModalFormData((prev) => ({ ...prev, [name]: file }));
        if (file) {
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
          }
          setImagePreview(URL.createObjectURL(file));
        } else {
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
          }
          setImagePreview(null);
        }
      } else {
        setModalFormData((prev) => ({ ...prev, [name]: value }));
      }

      if (modalErrors[name as keyof Omit<PackageItem, "id">]) {
        setModalErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    };

    const handleModalSelectChange = (value: string) => {
      setModalFormData((prev) => ({
        ...prev,
        packageType: value as PackageType,
      }));
      if (modalErrors.packageType) {
        setModalErrors((prev) => ({ ...prev, packageType: undefined }));
      }
    };

    const validateModalForm = () => {
      const newErrors: Partial<Record<keyof Omit<PackageItem, "id">, string>> =
        {};
      if (!modalFormData.description.trim())
        newErrors.description = "La description est requise.";
      if (!modalFormData.quantity || parseInt(modalFormData.quantity) <= 0)
        newErrors.quantity = "La quantité doit être positive.";
      if (!modalFormData.weight || parseFloat(modalFormData.weight) <= 0)
        newErrors.weight = "Le poids est requis et doit être positif.";
      // if (!modalFormData.value || parseFloat(modalFormData.value) <= 0)
      //   newErrors.value = "La valeur est requise et doit être positive.";
      if (!modalFormData.packageType)
        newErrors.packageType = "Le type de colis est requis.";

      setModalErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSavePackage = () => {
      if (!validateModalForm()) return;

      const packageDataToSave = { ...modalFormData };

      if (editingPackage) {
        const updatedPackages = packages.map((pkg) =>
          pkg.id === editingPackage.id
            ? { ...editingPackage, ...packageDataToSave }
            : pkg
        );
        updateData(updatedPackages);
      } else {
        const newPackage: PackageItem = {
          id: uuidv4(),
          ...packageDataToSave,
        };
        updateData([...packages, newPackage]);
      }
      setIsModalOpen(false);
      setEditingPackage(null);
      // L'imagePreview sera nettoyé par le useEffect [isModalOpen, editingPackage]
    };

    const handleEditPackage = (pkg: PackageItem) => {
      setEditingPackage(pkg);
      setIsModalOpen(true);
    };

    const handleDeletePackage = (id: string) => {
      updateData(packages.filter((pkg) => pkg.id !== id));
    };

    useImperativeHandle(ref, () => ({
      validateForm: () => {
        if (packages.length === 0) {
          alert("Veuillez ajouter au moins un colis.");
          return false;
        }
        return true;
      },
    }));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Détails des Colis
          </h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPackage(null);
                  setIsModalOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un colis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  {editingPackage
                    ? "Modifier le colis"
                    : "Ajouter un nouveau colis"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="quantity"
                      className="text-gray-700 dark:text-gray-300 mb-3"
                    >
                      Quantité
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={modalFormData.quantity}
                      onChange={handleModalInputChange}
                      placeholder="ex: 1"
                      className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${modalErrors.quantity ? "border-red-500" : ""}`}
                    />
                    {modalErrors.quantity && (
                      <p className="text-xs text-red-500 mt-1">
                        {modalErrors.quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="weight"
                      className="text-gray-700 dark:text-gray-300 mb-3"
                    >
                      Poids (kg)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={modalFormData.weight}
                      onChange={handleModalInputChange}
                      placeholder="ex: 2.5"
                      className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${modalErrors.weight ? "border-red-500" : ""}`}
                    />
                    {modalErrors.weight && (
                      <p className="text-xs text-red-500 mt-1">
                        {modalErrors.weight}
                      </p>
                    )}
                  </div>
                </div>

                <div className="">
                  <div>
                    <Label
                      htmlFor="packageType"
                      className="text-gray-700 dark:text-gray-300 mb-3"
                    >
                      Type de colis
                    </Label>
                    <Select
                      name="packageType"
                      value={modalFormData.packageType}
                      onValueChange={handleModalSelectChange}
                    >
                      <SelectTrigger
                        className={`mt-1 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${modalErrors.packageType ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        {packageTypeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {modalErrors.packageType && (
                      <p className="text-xs text-red-500 mt-1">
                        {modalErrors.packageType}
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <Label
                      htmlFor="value"
                      className="text-gray-700 dark:text-gray-300 mb-3"
                    >
                      Valeur du colis
                    </Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={modalFormData.value}
                      onChange={handleModalInputChange}
                      placeholder="ex: 5000"
                      className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${modalErrors.value ? "border-red-500" : ""}`}
                    />
                    {modalErrors.value && (
                      <p className="text-xs text-red-500 mt-1">
                        {modalErrors.value}
                      </p>
                    )}
                  </div> */}
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-gray-700 dark:text-gray-300 mb-1" // mb-3 to mb-1
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={modalFormData.description}
                    onChange={handleModalInputChange}
                    placeholder="Description du contenu"
                    className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${modalErrors.description ? "border-red-500" : ""}`}
                  />
                  {modalErrors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {modalErrors.description}
                    </p>
                  )}
                </div>

                {/* Nouveau champ pour l'upload de photo */}
                <div>
                  <Label
                    htmlFor="imageFile"
                    className="text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Photo du colis (optionnel)
                  </Label>
                  <Input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*" // Accepter tous les types d'images
                    onChange={handleModalInputChange}
                    className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/20 dark:file:text-blue-300 dark:hover:file:bg-blue-500/30 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Aperçu du colis"
                        className="h-24 w-auto rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleSavePackage}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {editingPackage
                    ? "Enregistrer les modifications"
                    : "Ajouter le colis"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
            <PackageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun colis ajouté
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par ajouter votre premier colis.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  setEditingPackage(null);
                  setIsModalOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un colis
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                <TableRow>
                  <TableHead className="w-[50px] text-gray-700 dark:text-gray-300">
                    N°
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Description
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Qté
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Poids (kg)
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Type
                  </TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {packages.map((pkg, index) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {pkg.description}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {pkg.quantity}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {pkg.weight}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {packageTypeOptions.find(
                        (opt) => opt.value === pkg.packageType
                      )?.label || pkg.packageType}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPackage(pkg)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }
);

Step3_PackageDetails.displayName = "Step3_PackageDetails";
export default Step3_PackageDetails;
