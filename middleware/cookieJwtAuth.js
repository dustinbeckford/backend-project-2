const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, next) => {
    console.log(req.cookies)
	const token = req.cookies.token;
	try {
		// The important part
		const user = jwt.verify(token, process.env.MY_SECRET);
		req.user = user;
		next();
	} catch (err) {
		res.clearCookie("token");
		return res.redirect("/login");
    }
};