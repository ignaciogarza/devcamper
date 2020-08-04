const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geoCoder");
const Bootcamp = require("../models/Bootcamp");

// @desc        Get all bootcamps
// @Route       Get /api/v1/bootcamps
// @Access      Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over remove field and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $gte, etc)

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing our query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc        Get single bootcamp
// @Route       Get /api/v1/bootcamps/:id
// @Access      Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc        Create new bootcamp
// @Route       Post /api/v1/bootcamps
// @Access      Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc        Update bootcamp
// @Route       Put /api/v1/bootcamps/:id
// @Access      Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Delete bootcamp
// @Route       Delete /api/v1/bootcamps/:id
// @Access      Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc        Get bootcamps within a radius
// @Route       Get /api/v1/bootcamps/radius/:zipcode/:distance
// @Access      Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lat and long from GeoCoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calculate radius
  //divide distance by radius of Earth
  // Earth Radius = 3,963 MI / 6,378 KM

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
