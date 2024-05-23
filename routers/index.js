const userRouter = require('./userRouter');
const taskRouter = require('./taskRouter');
const categoryRouter = require('./categoryRouter')
const taskListRouter = require('./taskListRouter')
// Import other routers here

const routes = [
    {
        path: "/user",
        router: userRouter,
    },
    {
        path: "/task",
        router: taskRouter,
    },
    {
        path: "/category",
        router: categoryRouter,
    },
    {
        path: "/tasklist",
        router: taskListRouter,
    }
];

const configureRoutes = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.router);
    });
};

module.exports = configureRoutes;
