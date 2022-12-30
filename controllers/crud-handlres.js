import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/ApiFeatures.js';

// getAll
export const getAllHandler = Model =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndDelete(id);
    if (!document) return next(new ApiError(`document not found.`, 404));
    res.status(200).json({ message: 'deleted' });
  });

// getOne
export const getOneHandler = Model =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndDelete(id);
    if (!document) return next(new ApiError(`document not found.`, 404));
    res.status(200).json({ message: 'deleted' });
  });

// create
export const createHandler = Model =>
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

// update
export const updateHandler = Model =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const document = await Model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document) return next(new ApiError(`document not found.`, 404));

    res.status(200).json({ data: document });
  });

// delete
export const deleteHandler = Model =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndDelete(id);
    if (!document) return next(new ApiError(`document not found.`, 404));
    res.status(200).json({ message: 'deleted' });
  });
