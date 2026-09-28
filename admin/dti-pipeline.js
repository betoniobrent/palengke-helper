(function (root) {
    function boxesFromOperators(list, ops) {
        let matrix = [1, 0, 0, 1, 0, 0];
        const stack = [], boxes = [];
        const point = (x, y) => [matrix[0]*x+matrix[2]*y+matrix[4], matrix[1]*x+matrix[3]*y+matrix[5]];
        function box(points) {
            if (!points.length) return;
            const xy = points.map(p => point(...p));
            boxes.push({ x0: Math.min(...xy.map(p=>p[0])), x1: Math.max(...xy.map(p=>p[0])), y0: Math.min(...xy.map(p=>p[1])), y1: Math.max(...xy.map(p=>p[1])) });
        }
        for (let i=0;i<list.fnArray.length;i++) {
            const op=list.fnArray[i], args=list.argsArray[i];
            if (op===ops.save) stack.push(matrix.slice());
            else if (op===ops.restore) matrix=stack.pop() || [1,0,0,1,0,0];
            else if (op===ops.transform) {
                const [a,b,c,d,e,f]=matrix, [g,h,j,k,l,m]=args;
                matrix=[a*g+c*h,b*g+d*h,a*j+c*k,b*j+d*k,a*l+c*m+e,b*l+d*m+f];
            } else if (op===ops.constructPath) {
                let offset=0, points=[];
                for (const command of args[0]) {
                    if (command===ops.rectangle) {
                        const [x,y,w,h]=args[1].slice(offset,offset+4); offset+=4;
                        box([[x,y],[x+w,y+h]]);
                    } else if (command===ops.moveTo || command===ops.lineTo) {
                        if (command===ops.moveTo) { box(points); points=[]; }
                        points.push(args[1].slice(offset,offset+2)); offset+=2;
                    } else if (command===ops.closePath) { box(points); points=[]; }
                    else { offset += command===ops.curveTo ? 6 : 4; points=[]; }
                }
                box(points);
            }
        }
        return boxes;
    }
    function parse(pages) {
        const rows=[];
        let section='';
        for (const page of pages) {
            const items=page.items.filter(i=>i.str.trim()).map(i=>({...i,x:i.x??i.transform[4],y:i.y??i.transform[5]}));
            const headers=items.filter(i=>i.str.trim()==='SRP').sort((a,b)=>a.x-b.x);
            if (headers.length!==3) throw new Error('Unsupported DTI layout: expected three SRP columns. Nothing was published.');
            for (let column=0;column<headers.length;column++) {
                const header=headers[column];
                const unit=items.find(i=>i.str.trim()==='UNIT' && Math.abs(i.y-header.y)<2 && i.x<header.x && i.x>header.x-80);
                const left=column ? headers[column-1].x+headers[column-1].width+2 : 0;
                if (!unit) throw new Error('DTI unit column missing.');
                const edges=[];
                for (const b of page.boxes) if (b.x0<header.x && b.x1>header.x+5 && b.x1-b.x0>20) edges.push(b.y0,b.y1);
                const bounds=edges.sort((a,b)=>b-a).filter((y,i,a)=>!i || Math.abs(y-a[i-1])>0.5);
                const col=items.filter(i=>i.x>=left && i.x<header.x+header.width+15 && i.y<header.y-3);
                const used=new Set();
                for (let b=0;b<bounds.length-1;b++) {
                    const top=bounds[b], bottom=bounds[b+1];
                    const cell=col.filter(i=>i.y>bottom && i.y<top);
                    if (!cell.length) continue;
                    const name=cell.filter(i=>i.x<unit.x-15).sort((a,b)=>b.y-a.y || a.x-b.x).map(i=>i.str).join(' ').replace(/\s+/g,' ').trim();
                    const prices=cell.filter(i=>i.x>header.x-10 && /^\d+(?:,\d{3})*\.\d{2}$/.test(i.str.trim()));
                    if (!prices.length) {
                        if (name && name===name.toUpperCase() && !/BASIC NECESSITIES|PRIME COMMODITIES|PROCESSED MILK|BOTTLED WATER|^SALT$|^CONDIMENTS$/.test(name)) section=name;
                        continue;
                    }
                    if (prices.length!==1 || !name || !section) throw new Error('DTI table row could not be read completely.');
                    const size=cell.filter(i=>i.x>=unit.x-15 && i.x<header.x-10).map(i=>i.str).join(' ').trim();
                    if (!size) throw new Error('DTI product pack size missing.');
                    used.add(prices[0]);
                    const household=/SOAP|CANDLES|BATTERIES/.test(section);
                    let region='Nationwide';
                    if (/Visayas\s*(?:\/|&)\s*Mindanao/i.test(name)) region='Visayas / Mindanao';
                    else if (/\bLuzon\b/i.test(name)) region='Luzon';
                    rows.push({item_name:`${section} — ${name}`,category:household?'household':'other food',unit:size,price_min:Number(prices[0].str.replace(/,/g,'')),price_max:Number(prices[0].str.replace(/,/g,'')),region,notes:'DTI suggested retail price (SRP); per stated pack size. Applies to supermarkets and wet markets unless specified.'});
                }
                const expected=col.filter(i=>i.x>header.x-10 && /^\d+(?:,\d{3})*\.\d{2}$/.test(i.str.trim())).length;
                if (used.size!==expected || !expected) throw new Error('Incomplete DTI extraction. Nothing was published.');
            }
        }
        return rows;
    }
    const api={parse,boxesFromOperators};
    if (typeof module!=='undefined') module.exports=api;
    root.DtiPipeline=api;
})(typeof window!=='undefined'?window:globalThis);
