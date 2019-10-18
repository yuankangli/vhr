import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args) => {
    for (let i = 0; i < args.length; i++) {
        const argument = args[i];
        if (argument == null || argument === '' || argument === undefined) {
            Message.warning({message: '数据不能为空!'});
            return false;
        }
    }
    return true;
};
export const forward404 = (router) => {
    let forward = [{
        path: "*", // 此处需特别注意置于最底部
        redirect: "/404"
    }];
    router.addRoutes(forward);
};
export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/config/sysmenu").then(resp => {
        // debugger;
        if (resp && resp.status === 200) {
            const fmtRoutes = formatRoutes(resp.data);
            // debugger;
            router.addRoutes(fmtRoutes);
            store.commit('initMenu', fmtRoutes);
            store.dispatch('connect');
            forward404(router);
        }
    })
};
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../components/' + component + '.vue'], resolve)
                } else if (component.startsWith("Emp")) {
                    require(['../components/emp/' + component + '.vue'], resolve)
                } else if (component.startsWith("Per")) {
                    require(['../components/personnel/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sal")) {
                    require(['../components/salary/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sta")) {
                    require(['../components/statistics/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sys")) {
                    require(['../components/system/' + component + '.vue'], resolve)
                }
            },
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children
        };
        fmRoutes.push(fmRouter);
    });
    return fmRoutes;
};
