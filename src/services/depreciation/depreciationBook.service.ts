import { eq } from "drizzle-orm";
import { db } from "../../config/database";
import { depreciationBookModel, NewDepBook } from "../../schemas";
import { BadRequestError } from "../utils/errors.utils";



export const createDepBook = async (
  depBookData: NewDepBook
) => {
  try {
    const [newDepBook] = await db.insert(depreciationBookModel).values(
      depBookData
    );

    return newDepBook;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All DepBooks
export const getAllDepBooks = async () => {
  const depBooks = await db.select().from(depreciationBookModel);
  return depBooks;
};

// Helper function to get depBook by ID
export const getDepBookById = async (depBookId: number) => {
    const depBook = await db
        .select()
        .from(depreciationBookModel)
        .where(eq(depreciationBookModel.id, depBookId))
        .limit(1);

    if (!depBook.length) {
        throw BadRequestError("DepBook not found");
    }

    return depBook[0];
};
//Helper funciton for Update DepBook


export const editDepBook = async (
    depBookId: number,
    depBookData: Partial<NewDepBook>
) => {
    const [updatedDepBook] = await db
        .update(depreciationBookModel)
        .set({
            ...depBookData,
         
        })
        .where(eq(depreciationBookModel.id, depBookId))

    return updatedDepBook;
};