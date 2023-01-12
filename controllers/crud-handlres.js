// الدالة دي بتخيليني اما اعمل اويت للرسبونس بتاع المونجو سرفر لما يحصل ايرور ف هي هترميه تلقائي ل اكسبرس
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import slugify from 'slugify';

// getAll
export const getAllHandler = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .paginate()
      .sort()
      .search()
      .filter()
      .limitFields();

    const documents = await apiFeatures.mongooseQuery;

    res.status(200).json({ status: 'success', data: documents });
  });

// getOne
export const getOneHandler = (Model, modelName, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (populateOptions) {
      query = query.populate([populateOptions]);
    }
    const document = await query;
    if (!document)
      return next(
        new ApiError(`${modelName ? modelName : 'document'} not found.`, 404)
      );
    res.status(200).json({ status: 'success', data: document });
  });

// create
export const createHandler = Model =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: document });
  });

// update
export const updateHandler = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!document)
      return next(
        new ApiError(`${modelName ? modelName : 'document'} not found.`, 404)
      );

    res.status(200).json({ data: document });
  });

// delete
export const deleteHandler = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document)
      return next(
        new ApiError(`${modelName ? modelName : 'document'} not found.`, 404)
      );
    res.status(204).json({
      status: 'success',
      message: `${modelName ? modelName : 'document'} deleted`,
    });
  });
