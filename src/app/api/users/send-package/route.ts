import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { localization, contact} = await request.json();

        const { packageDetails } = await request.json();

        const { zoneDepart, zoneDestination, shippingDate } = localization;

        const { senderName, senderPhone, recipientName, recipientPhone, notifyRecipient } = contact;

        // const user = await prisma.user.findUnique({
        //     where: {
                
        //     }
        // })

        // const { description, packageCategory, quantity, weight } = packageDetails;

        // const newPackage = await prisma.package.create({
        //     data: {
        //         description,
        //         category : packageCategory,
        //         quantity,
        //         weight,
        //     }
         
        // })

        // packageDetails.forEach(async (item, index) => {
        //     const newPackage = await prisma.package.create({
        //         data: {
        //             description: item.description,
        //             quantity: item.quantity,
        //             category: item.packageCategory,
        //             weight: item.weight,
        //             user: {
        //                 connect: {
        //                     id: "userId" // You'll need to provide the actual user ID
        //                 }
        //             },
        //             reservation: {
        //                 create: {
        //                     shippingDate,
        //                     zoneDepart,
        //                     zoneDestination,
        //                     senderName,
        //                     senderPhone,
        //                     recipientName, 
        //                     recipientPhone,
        //                     notifyRecipient
        //                 }
        //             }
        //         }
                
        //     })
        // })
 

    } catch (error) {
        
    }
}