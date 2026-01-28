'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Plus, Trash2, Image as ImageIcon, Hash,Layers } from "lucide-react";
import { toast } from 'sonner';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Variation {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  threshold: number;
  images: string[];
}

    function AttributeItem({
  attr,
  index,
  disabled,
  updateAttributeName,
  addAttributeValue,
  removeAttribute,
  removeAttributeValue,
}: {
  attr: { name: string; values: string[] };
  index: number;
  disabled: boolean;
  updateAttributeName: (index: number, name: string) => void;
  addAttributeValue: (index: number, value: string) => void;
  removeAttribute: (index: number) => void;
  removeAttributeValue: (attrIndex: number, valueIndex: number) => void;
}) {
  const [newValue, setNewValue] = useState("");

  

  return (
    <div className="space-y-2 border p-3 rounded-lg">
     
      <div className="flex gap-2">
        <Input
        disabled={disabled}
        placeholder="Attribute name (e.g., Color)"
        value={attr.name}
        onChange={(e) =>
            updateAttributeName(index, e.target.value)
        }
        />
       <Button
        disabled={disabled}
        variant="destructive"
        size="icon"
        onClick={() => removeAttribute(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

    
      <div className="flex flex-wrap gap-2">
        {attr.values.map((value, vIndex) => (
          <div
            key={vIndex}
            className="flex items-center gap-1 bg-gray-100 text-gray-900 px-3 py-1 rounded-full"
          >
            <span>{value}</span>
            <button
              className="text-gray-400 hover:text-red-500"
              onClick={() =>
                removeAttributeValue(index, vIndex)
              }
            >
              ×
            </button>
          </div>
        ))}
      </div>

     
      <div className="flex gap-2">
       <Input
        disabled={disabled}
        placeholder="Add value (e.g., Red)"
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        />
        <Button
         disabled={disabled}
          size="sm"
          onClick={() => {
            addAttributeValue(index, newValue);
            setNewValue("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function AddProductForm() {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [hasVariations, setHasVariations] = useState(false);
  const [variantsGenerated, setVariantsGenerated] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<
  { id: string; name: string; values: string[] }[]
>([
  { id: crypto.randomUUID(), name: "Color", values: ["Red", "Blue"] },
  { id: crypto.randomUUID(), name: "Size", values: ["S", "M", "L"] },
]);
    const [productName, setProductName] = useState<string>("");
const [brand, setBrand] = useState<string>("");

const [customBaseSku, setCustomBaseSku] = useState<string | null>(null);


const [categoryModalOpen, setCategoryModalOpen] = useState(false);
const [newCategoryName, setNewCategoryName] = useState("");

    function abbreviateWord(word: string): string {
  if (word.length <= 3) return word.toUpperCase();
  return word.slice(0, 4).toUpperCase();
}

function generateBaseSku(
  brand: string,
  productName: string
): string {
  if (!brand || !productName) return "";

  const brandPart = brand.trim().toUpperCase();

  const productPart = productName
    .trim()
    .split(/\s+/)
    .map(abbreviateWord)
    .join("-");

  return `${brandPart}-${productPart}`;
}

const computedBaseSku: string = generateBaseSku(brand, productName);

const baseSku: string =
  customBaseSku !== null ? customBaseSku : computedBaseSku;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

const addAttribute = () => {
  setAttributes(prev => [
    ...prev,
    { id: crypto.randomUUID(), name: "", values: [] },
  ]);
};

const generateVariations = () => {
  setVariantsGenerated(true);
  syncVariations();
  toast.success("Variants generated");
};


  const updateVariation = (
  id: number,
  field: keyof Variation,
  value: number
) => {
  setVariations(prev =>
    prev.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    )
  );
};

const updateVariantText = (
  id: number,
  field: "barcode",
  value: string
) => {
  setVariations(prev =>
    prev.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    )
  );
};


const updateAttributeName = (index: number, name: string) => {
  setAttributes(prev => {
    const copy = [...prev];
    copy[index].name = name;
    return copy;
  });
};

const addAttributeValue = (attrIndex: number, value: string) => {
  if (!value.trim()) return;

  setAttributes(prev => {
    const next = prev.map((attr, i) =>
      i === attrIndex
        ? { ...attr, values: [...attr.values, value] }
        : attr
    );

    if (variantsGenerated) {
      queueMicrotask(syncVariations);
    }

    return next;
  });
};

const removeAttribute = (index: number) => {
  setAttributes(prev => {
    const next = prev.filter((_, i) => i !== index);

    if (variantsGenerated) {
      queueMicrotask(syncVariations);
    }

    return next;
  });
};


const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
  setAttributes(prev => {
    const next = prev.map((attr, i) =>
      i === attrIndex
        ? {
            ...attr,
            values: attr.values.filter((_, v) => v !== valueIndex),
          }
        : attr
    );

    if (variantsGenerated) {
      queueMicrotask(syncVariations);
    }

    return next;
  });
};



function generateCombinations(attributes: { name: string; values: string[] }[]) {
  const validAttrs = attributes.filter(
    a => a.name.trim() && a.values.length > 0
  );

  if (validAttrs.length === 0) return [];

  return validAttrs.reduce<string[][]>(
    (acc, attr) =>
      acc.flatMap(prev =>
        attr.values.map(value => [...prev, value])
      ),
    [[]]
  );
}

function buildVariations(
  attributes: { name: string; values: string[] }[],
  existing: Variation[],
  baseSku: string
): Variation[] {
  const combos = generateCombinations(attributes);

  return combos.map((combo, index) => {
    const name = combo.join("-");

      const variantPart = combo
      .map(v => v.toUpperCase())
      .join("-");

    const sku = `${variantPart}-${baseSku}`;

    const existingVariant = existing.find(v => v.name === name);

    return {
      id: existingVariant?.id ?? Date.now() + index,
      name,
      sku,
      barcode: existingVariant?.barcode ?? "",
      costPrice: existingVariant?.costPrice ?? 0,
      sellingPrice: existingVariant?.sellingPrice ?? 0,
      quantity: existingVariant?.quantity ?? 0,
      threshold: existingVariant?.threshold ?? 0,
      images: existingVariant?.images ?? [],
    };
  });
}




const syncVariations = () => {
  setVariations(prev => buildVariations(attributes, prev, baseSku));
};


const removeVariant = (id: number) => {
  setVariations(prev => {
    const next = prev.filter(v => v.id !== id);

    if (next.length === 0) {
      setVariantsGenerated(false);
    }

    return next;
  });
};


const attributesLocked = variantsGenerated && variations.length > 0;

const handleVariantImageUpload = (id: number, files: FileList | null) => {
  if (!files) return;

  const newImages = Array.from(files).map(file => URL.createObjectURL(file));

  setVariations(prev =>
    prev.map(v =>
      v.id === id ? { ...v, images: [...v.images, ...newImages] } : v
    )
  );
};


  return (
    <div className="space-y-6 bg-white">
      <Card className='bg-white border-2 border-gray-900 rounded-2xl text-gray-900 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-gray-900'>Add New Product</CardTitle>
          <CardDescription className='text-gray-900'>
            Fill in the product details and variations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
       
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className='flex flex-col gap-3'>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProductName(e.target.value)
                    }
                    className='border-gray-900 border-2 shadow-lg'
                    />
                </div>
                
               <div className='flex flex-col gap-3'>
                  <Label htmlFor="brand">Brand</Label>
                    <Input
                    id="brand"
                    value={brand}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBrand(e.target.value)
                    }
                     className='border-gray-900 border-2 shadow-lg'
                    />

                </div>
                
                <div>
                  <Label className='mb-2' htmlFor="category">Category</Label>
                  <Select >
                    <SelectTrigger  className='border-gray-900 border-2 shadow-lg text-gray-900' >
                      <SelectValue className='text-gray-900' placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="jackets">Jackets</SelectItem>
                      <SelectItem value="shirts">Shirts</SelectItem>
                      <SelectItem value="pants">Pants</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                    </SelectContent>
                  </Select>
                 <Button
                    variant="link"
                    size="sm"
                    className="mt-1 p-0 h-auto text-gray-900"
                    onClick={() => setCategoryModalOpen(true)}
                    >
                    <Plus className="h-3 w-3 mr-1" />
                    Create new category
                    </Button>

                </div>
              </div>
              
              <div className="space-y-4">
                 <div className='flex flex-col gap-3'>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="e.g., Pieces" defaultValue="Pieces"  className='border-gray-900 border-2 shadow-lg' />
                </div>
                
                <div className='flex flex-col gap-3'>
                  <Label htmlFor="sku">Base SKU</Label>
                  <div className="flex gap-2">
                    <Input
                        id="sku"
                        value={baseSku}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setCustomBaseSku(e.target.value.toUpperCase())
                        }
                         className='border-gray-900 border-2 shadow-lg'
                    />

                    <Button variant="outline" size="icon">
                      <Hash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="taxable" className='text-gray-900 border-2 border-gray-950' />
                  <Label htmlFor="taxable" className="cursor-pointer">
                    Product is taxable
                  </Label>
                </div>
              </div>
            </div>

         
            <div className="flex items-center justify-between p-4  bg-gray-900 rounded-lg">
              <div>
                <Label className="font-medium text-white">Product has variations</Label>
                <p className="text-sm text-white">
                  Enable if product comes in different colors, sizes, etc.
                </p>
              </div>
              <Switch checked={hasVariations} onCheckedChange={setHasVariations} />
            </div>

        
            <div className='flex flex-col gap-3'>
              <Label htmlFor="description">Product Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the product features, materials, care instructions..."
                rows={4}
                className='border-gray-900 border-2 shadow-lg'
              />
            </div>

          
           <div className='flex flex-col gap-3'>
              <Label>Product Images</Label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image width={200} height={200} src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center transition-colors">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Add Images</span>
                  </div>
                </label>
              </div>
            </div>

            
            {hasVariations ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Variations Management</h3>
                    <p className="text-sm text-gray-500">Define attributes and generate variations</p>
                  </div>
                 <Button
                    onClick={generateVariations}
                    disabled={variantsGenerated}
                    className="flex items-center gap-2  bg-gray-900 text-white hover:bg-gray-800"
                    >
                    <Layers className="h-4 w-4" />
                    {variantsGenerated ? "Variants Generated" : "Generate Variations"}
                  </Button>
                </div>

               
                <Card className='bg-white border-2 border-gray-900'>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-900">Attributes</CardTitle>
                  </CardHeader>
                <CardContent className="space-y-4 text-gray-900">
                 {attributes.map((attr, index) => (
                    <AttributeItem
                        key={attr.id}
                        attr={attr}
                        index={index}
                        disabled={attributesLocked}
                        updateAttributeName={updateAttributeName}
                        addAttributeValue={addAttributeValue}
                        removeAttribute={removeAttribute}
                        removeAttributeValue={removeAttributeValue}
                    />
                    ))}


                    <Button disabled={attributesLocked}  onClick={addAttribute} className="w-full bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Attribute
                    </Button>
                    </CardContent>


                </Card>

               
                <Card className='bg-white border-2 border-gray-900'>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-900">Generated Variations ({variations.length})</CardTitle>
                  </CardHeader>
                  <CardContent className=" text-gray-900">
                    <div className="space-y-4">
                      {variations.map((variant) => (
                        <div key={variant.id} className="p-4 border border-gray-900 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{variant.name}</div>
                              <div className="text-sm text-gray-900">SKU: {variant.sku}</div>
                            </div>
                            <Button variant="ghost" size="sm"  onClick={() => removeVariant(variant.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className='flex flex-col gap-3'>
                              <Label>Cost Price</Label>
                              <Input type="number" placeholder="0.00" value={variant.costPrice}  onChange={(e) =>
    updateVariation(variant.id, "costPrice", Number(e.target.value))
  } className='border-gray-900 border-2 shadow-lg' />
                            </div>
                            <div className='flex flex-col gap-3'>
                              <Label>Selling Price</Label>
                              <Input type="number" placeholder="0.00" value={variant.sellingPrice} onChange={(e) =>
    updateVariation(variant.id, "sellingPrice", Number(e.target.value))
  } className='border-gray-900 border-2 shadow-lg' />
                            </div>
                            <div className='flex flex-col gap-3'>
                              <Label>Quantity</Label>
                              <Input type="number" placeholder="0" value={variant.quantity} onChange={(e) =>
    updateVariation(variant.id, "quantity", Number(e.target.value))
  } className='border-gray-900 border-2 shadow-lg' />
                            </div>
                            <div className='flex flex-col gap-3'>
                              <Label>Threshold</Label>
                              <Input type="number" placeholder="0" value={variant.threshold} onChange={(e) =>
    updateVariation(variant.id, "threshold", Number(e.target.value))
  } className='border-gray-900 border-2 shadow-lg' />
                            </div>

                            <div className="flex flex-col gap-3">
                              <Label>Barcode</Label>
                              <Input
                                type="text"
                                placeholder="Scan or enter barcode"
                                value={variant.barcode}
                                onChange={(e) =>
                                  updateVariantText(variant.id, "barcode", e.target.value)
                                }
                                className="border-gray-900 border-2 shadow-lg"
                              />
                            </div>

                          </div>
                          
                          <div>
                            <Label>Variant Images</Label>
                            <div className="mt-2 flex gap-2">
                             <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleVariantImageUpload(variant.id, e.target.files)}
                                    />
                                    <div className="flex bg-gray-900 text-white items-center gap-1 px-2 py-1 rounded cursor-pointer">
                                        <ImageIcon className="h-3 w-3" />
                                        Add Images
                                    </div>
                                    </label>

                            </div>
                            <div className="flex mt-2 gap-2">
                            {variant.images.map((img, i) => (
                                <div key={i} className="relative w-12 h-12 rounded overflow-hidden">
                                <Image src={img} alt={`Variant ${i}`} width={48} height={48} className="object-cover" />
                                <button
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                                    onClick={() => {
                                    setVariations(prev =>
                                        prev.map(v =>
                                        v.id === variant.id
                                            ? { ...v, images: v.images.filter((_, idx) => idx !== i) }
                                            : v
                                        )
                                    );
                                    }}
                                >
                                    ×
                                </button>
                                </div>
                            ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
            
              <Card className='bg-white border-2 border-gray-900'>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-900">Product Details</CardTitle>
                </CardHeader>
                <CardContent className='text-gray-900'>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className='flex flex-col gap-3'>
                      <Label>Cost Price</Label>
                      <Input type="number" placeholder="0.00" className='border-gray-900 border-2 shadow-lg' />
                    </div>
                    <div className='flex flex-col gap-3'>
                      <Label>Selling Price</Label>
                      <Input type="number" placeholder="0.00" className='border-gray-900 border-2 shadow-lg' />
                    </div>
                    <div className='flex flex-col gap-3'>
                      <Label>Quantity</Label>
                      <Input type="number" placeholder="0" className='border-gray-900 border-2 shadow-lg' />
                    </div>
                   <div className='flex flex-col gap-3'>
                      <Label>Low Stock Threshold</Label>
                      <Input type="number" placeholder="10" className='border-gray-900 border-2 shadow-lg' />
                    </div>

                   <div className="flex flex-col gap-3">
                    <Label>Barcode</Label>
                    <Input
                      type="text"
                      placeholder="Scan or enter barcode"
                      className="border-gray-900 border-2 shadow-lg"
                    />
                  </div> 
                  </div>
                </CardContent>
              </Card>
            )}

            <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen} >
                <DialogContent className="sm:max-w-md bg-white text-gray-900">
                    <DialogHeader>
                    <DialogTitle className='text-gray-900'>New Category</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                        id="categoryName"
                        placeholder="e.g. Jackets"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className='border border-gray-900'
                        />
                    </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                    <Button
                        className='bg-red-500 text-gray-900 hover:bg-red-300'
                        onClick={() => {
                        setCategoryModalOpen(false);
                        setNewCategoryName("");
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-gray-900 text-white hover:bg-gray-800"
                        disabled={!newCategoryName.trim()}
                        onClick={() => {
                        toast.success(`Category "${newCategoryName}" created`);
                        setCategoryModalOpen(false);
                        setNewCategoryName("");
                        }}
                    >
                        Create Category
                    </Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>

           
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Create Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}