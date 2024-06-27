class SnapshotSandBox{
    windowSnapshot = {};
    modifyPropsMap = {};

    active () {
        for (const prop in window) {
            this.windowSnapshot[prop] = window[prop];
        }

        Object.keys(this.modifyPropsMap).forEach(prop => {
            window[prop] = this.modifyPropsMap[prop];
        });
    }

    inactive () {
        for (const prop in window) {
            if (window[prop] !== this.windowSnapshot[prop]) {
                this.modifyPropsMap[prop] = window[prop];
                window[prop] = this.windowSnapshot[prop];
            }
        }
    }
}
// 验证:
let snapshotSandBox = new SnapshotSandBox();

// 激活
snapshotSandBox.active();

// 修改
window.city = 'Beijing';
console.log("window.city-01:", window.city);

// 卸载
snapshotSandBox.inactive();
console.log("window.city-02:", window.city);

// 重新激活
snapshotSandBox.active();
console.log("window.city-03:", window.city);

//输出：
//window.city-01: Beijing
//window.city-02: undefined
//window.city-03: Beijing