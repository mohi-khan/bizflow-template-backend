
import { NextFunction, Request, Response } from "express";
import { createInsertSchema } from "drizzle-zod";
import { disposeModel} from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";
import { createDispose, editDispose, getAllDispose, getDisposeByDisposeDateAndCompany, getDisposeById } from "../services/dispose.service";
import { BadRequestError } from "../services/utils/errors.utils";
import { z } from "zod";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);



const createDisposeSchema = createInsertSchema(disposeModel).extend({
  dispose_date: dateStringToDate
})
const editDisposeSchema = createDisposeSchema.omit({
    id: true,

  }) .extend({
    method: createDisposeSchema.shape.method.optional(),
    dispose_date:createDisposeSchema.shape.dispose_date.optional(),
    reason:createDisposeSchema.shape.reason.optional(),
    remarks:createDisposeSchema.shape.remarks.optional(),
    performed_by:createDisposeSchema.shape.performed_by.optional(),
    value:createDisposeSchema.shape.value.optional(),

  });



// create Dispose
export const createDisposeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // requirePermission(req, 'create_dispose');


    const disposeData = createDisposeSchema.parse(req.body);
    const dispose = await createDispose(disposeData);

    res.status(201).json({
      status: "success",
      data: {
        dispose,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get all warratny
export const getAllDisposeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_dispose');
    const disposes = await getAllDispose();
    res.json(disposes);
  } catch (error) {
    next(error);
  }
};

export const getDisposeByDisposeDateAndCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_dispose_by_dispose_date_and_company');

    const disposeDate = req.params.dispose_date;
    const companyId = Number(req.params.company_id);


    if (isNaN(new Date(disposeDate).getTime())) {
      throw BadRequestError("Invalid date format");
    }


    if (isNaN(companyId)) {
      throw BadRequestError("Invalid company ID");
    }

    const disposes = await getDisposeByDisposeDateAndCompany(disposeDate, companyId);
    res.json(disposes);
  } catch (error) {
    next(error);
  }
};


export const getDisposeByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_dispose_details');
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw BadRequestError("Invalid ID");
    }

    const dispose = await getDisposeById(id);
    res.json(dispose);
  } catch (error) {
    next(error);
  }
};


// edit dispose
export const editDisposeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_dispose');        
        const disposeId: number = Number(req.params.id);
        const disposeData = editDisposeSchema.parse(req.body);
        const updatedWarratny = await editDispose(disposeId, disposeData);

        res.json({
            status: "success",
            data: {
                updatedWarratny,
            },
        });
    } catch (error) {
        next(error);
    }
};
