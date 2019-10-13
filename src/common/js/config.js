export const MENU_CONFIG = [{
    title: '首页',
    key: '/home'
}, {
    title: '菜品',
    key: '/dishes',
    children: [{
        title: '添加菜品',
        key: '/dishes/add'
    }, {
        title: '编辑菜品',
        key: '/dishes/edit'
    }]
}, {
    title: '订单',
    key: '/order',
    children: [{
        title: '订单管理',
        key: '/order'
    }]
}]