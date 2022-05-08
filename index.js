require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');


const PORT = process.env.PORT || 6000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

//? выгрузка index.html для всех запросов на хосте
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'public')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
	});
}

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		app.listen(PORT, () => console.log(`Server started on PORT \n http://localhost:${PORT}`))
	} catch (error) {
		console.log(error);

	}
}

start();
