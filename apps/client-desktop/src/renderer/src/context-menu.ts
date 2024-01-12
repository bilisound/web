import { MenuItemConstructorOptions } from "electron";

const menuTemplateBefore: MenuItemConstructorOptions[] = [
    {
        label: "撤销",
        role: "undo",
        accelerator: "CmdOrCtrl+Z",
    }, {
        label: "重做",
        role: "redo",
        accelerator: "Shift+CmdOrCtrl+Z",
    }, {
        type: "separator",
    }, {
        label: "剪切",
        role: "cut",
        accelerator: "CmdOrCtrl+X",
    }, {
        label: "复制",
        role: "copy",
        accelerator: "CmdOrCtrl+C",
    },
];
const menuTemplate: MenuItemConstructorOptions[] = [
    {
        label: "粘贴",
        role: "paste",
        accelerator: "CmdOrCtrl+V",
    }, {
        type: "separator",
    }, {
        label: "选择全部",
        role: "selectAll",
        accelerator: "CmdOrCtrl+A",
    },
];

document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let node = e.target as HTMLElement;
    const menu: MenuItemConstructorOptions[] = [];

    // 文本框右键菜单的处理
    while (node) {
        if (node instanceof HTMLElement && node.classList.contains("user-selectable")) {
            menu.push({
                label: "复制",
                role: "copy",
                accelerator: "CmdOrCtrl+C",
            });
            break;
        }
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            const n = node as HTMLInputElement;
            const isPassword = !n.type || n.type !== "password";

            // 禁用的文本框只能复制
            if (n.disabled) {
                menu.push({
                    label: "复制",
                    role: "copy",
                    accelerator: "CmdOrCtrl+C",
                });
                break;
            }

            // 如果是密码框的话，只需要粘贴和选择全部
            if (isPassword) {
                menu.push(...menuTemplateBefore);
            }
            menu.push(...menuTemplate);
            break;
        }
        node = node.parentNode as HTMLElement;
    }

    // 如果有需要添加的菜单，就加上它并显示出来
    window.electron.ipcRenderer.send("requestContextMenu", menu);
});
