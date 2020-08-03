// @desc        Get all bootcamps
// @Route       Get /api/v1/bootcamps
// @Access      Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc        Get single bootcamp
// @Route       Get /api/v1/bootcamps/:id
// @Access      Public

exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// @desc        Create new bootcamp
// @Route       Post /api/v1/bootcamps
// @Access      Private

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "create new Bootcamp" });
};

// @desc        Update bootcamp
// @Route       Put /api/v1/bootcamps/:id
// @Access      Private

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc        Delete bootcamp
// @Route       Delete /api/v1/bootcamps/:id
// @Access      Private

exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
