import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Fonction pour mapper les catégories du frontend vers l'enum Prisma
function mapPackageCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    documents: "DOCUMENTS",
    electronics: "ELECTRONICS",
    clothing: "CLOTHING",
    merchandises: "MERCHANDISES",
    others: "OTHERS",
  };

  return categoryMap[category?.toLowerCase()] || "OTHERS";
}

// Fonction pour sauvegarder une image
async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads", "packages");
    await mkdir(uploadsDir, { recursive: true });

    // Générer un nom unique pour le fichier
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convertir le fichier en buffer et le sauvegarder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retourner le chemin relatif pour stockage en base
    return `/uploads/packages/${fileName}`;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'image:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { user, error, status } = await getCurrentUser();
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur requis" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Extraire les données JSON
    const localizationData = formData.get("localization") as string;
    const contactData = formData.get("contact") as string;
    const packageDetailsData = formData.get("packageDetails") as string;

    const localization = JSON.parse(localizationData);
    const contact = JSON.parse(contactData);
    const packageDetails = JSON.parse(packageDetailsData);

    const { zoneDepart, zoneDestination, shippingDate } = localization;
    const {
      senderName,
      senderPhone,
      recipientName,
      recipientPhone,
      additionalInstructions,
      notifyRecipient,
    } = contact;

    if (!packageDetails || packageDetails.length === 0) {
      return NextResponse.json(
        { error: "Au moins un colis est requis" },
        { status: 400 }
      );
    }

    const processedPackages = await Promise.all(
      packageDetails.map(async (pkg: any, index: number) => {
        const mappedCategory = mapPackageCategory(pkg.packageCategory);

        const imageFile = formData.get(`package_${index}_image`) as File;
        const savedImagePath = await saveImage(imageFile);

        return {
          description: pkg.description,
          quantity: parseInt(pkg.quantity) || 1,
          category: mappedCategory as any,
          weight: parseFloat(pkg.weight) || 0,
          sender_userId: user.id,
          imageFile: savedImagePath,
        };
      })
    );

    const reservationData = {
      userId: user.id,
      departureLocation: {
        city: zoneDepart?.ville || "",
        district: zoneDepart?.quartier || "",
        preciseLocation: zoneDepart?.adressePrecise || "",
      },
      arrivalLocation: {
        city: zoneDestination?.ville || "",
        district: zoneDestination?.quartier || "",
        preciseLocation: zoneDestination?.adressePrecise || "",
      },
      senderContact: {
        fullName: senderName || "",
        phoneNumber: senderPhone || "",
      },
      receiverContact: {
        fullName: recipientName || "",
        phoneNumber: recipientPhone || "",
      },
      additionalInfo: additionalInstructions || null,
      shippingDate: new Date(shippingDate),
      status: "PENDING" as const,
      packages: {
        create: processedPackages,
      },
    };


    const reservation = await prisma.reservation.create({
      data: reservationData,
      include: {
        packages: true,
        user: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      reservation,
    });
  } catch (error: any) {
    console.error("❌ ERREUR DÉTAILLÉE:");
    console.error("Message:", error.message);

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la création de la réservation",
        details:
          process.env.NODE_ENV === "development"
            ? {
                message: error.message,
                code: error.code,
                meta: error.meta,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}
