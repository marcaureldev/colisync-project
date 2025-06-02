import { getCurrentUser } from "./currentUser";
import { prisma } from "./db";

export async function getAllBookings() {
  try {
    const { user, status, error, details } = await getCurrentUser();

    if (error) {
      return {
        reservations: null,
        error,
        details,
        status,
      };
    }
    const bookings = await prisma.reservation.findMany({
      where: {
        userId: user?.id,
      }
    });
    return { reservations: bookings, error: null, status: 200 };
  } catch (error) {
    return {
      reservations: null,
      error: "Une erreur est survenue.",
      details:
        process.env.NODE_ENV === "development" ? error : "Erreur interne",
      status: 500,
    };
  }
}
