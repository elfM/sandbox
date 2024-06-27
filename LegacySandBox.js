class LegacySandBox{
    addedPropsMapInSandbox = new Map();
    modifiedPropsOriginalValueMapInSandbox = new Map();
    currentUpdatedPropsValueMap = new Map();
    proxyWindow;
	
    setWindowProp (prop, value, toDelete = false) {
        if (value === undefined && toDelete) {
            delete window[prop];
        } else {
            window[prop] = value;
        }
    }
	
    active () {
        this.currentUpdatedPropsValueMap.forEach((value, prop) => this.setWindowProp(prop, value));
    }
	
    inactive () {
		// 复原修改的 key-value
        this.modifiedPropsOriginalValueMapInSandbox.forEach((value, prop) => this.setWindowProp(prop, value));
		// 删除新增的 key-value
        this.addedPropsMapInSandbox.forEach((_, prop) => this.setWindowProp(prop, undefined, true));
    }

    constructor () {
        const fakeWindow = Object.create(null);
		
        this.proxyWindow = new Proxy (fakeWindow, {
            set: (target, prop, value, receiver) => {
                const originalVal = window[prop];
                if (!window.hasOwnProperty(prop)) {
					// 记录添加的 key-value
                    this.addedPropsMapInSandbox.set(prop, value);
                } else if (!this.modifiedPropsOriginalValueMapInSandbox.has(prop)) {
					// 记录修改的原始 key-value
                    this.modifiedPropsOriginalValueMapInSandbox.set(prop, originalVal);
                }
				
				// 更新当前 window key-value
                this.currentUpdatedPropsValueMap.set(prop, value);
                window[prop] = value;
            },
            get: (target, prop, receiver) => {
                return target[prop];
            }
        });
    }
}
// 验证：
window.city = 'shanghai';
let legacySandBox = new LegacySandBox();
legacySandBox.active();

legacySandBox.proxyWindow.city = 'Beijing';
console.log('window.city-01:', window.city);

legacySandBox.inactive();
console.log('window.city-02:', window.city);

legacySandBox.active();
console.log('window.city-03:', window.city);
legacySandBox.inactive();

// 输出：
// window.city-01: Beijing
// window.city-02: shanghai
// window.city-03: Beijing