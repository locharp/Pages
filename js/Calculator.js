'use strict';

const DIGITS = '0123456789';
const NUMBERS = /(-?[[0-9]+\.?[0-9]*|-?[0-9]*\.[0-9]+]|-?π|-?e)/;
const NUMERIC_SYMBOLS = 'πe';
const NUMERIC = DIGITS + NUMERIC_SYMBOLS;
const FUNS_3 = [ 'log', 'sin', 'cos', 'tan' ];
const FUNS_6 = [ 'arcsin', 'arccos', 'arctan' ];
const FUNS_P = [ 'Px==', 'PX<=', 'PX>=' ];
const PRES = NUMERIC + '!)';
const POSTS = NUMERIC_SYMBOLS + '(√lscta';

let inp;
let oup;
let str;
let mem;

String.prototype.splice = function(start, delCount, s) {
    return this.substring(0, start) + s + this.substring(start + delCount);
};

function factorial(n)
{
    let fact = 1;

    for (let i = 2; i <= n; i++)
    {
        fact *= i;
    }
    
    return fact;
}

function nPk(n, k)
{
    if (k > n)
    {
        return 0;
    }
    
    let res = 1;
    
    for (let i = n; i > n - k; i--)
    {
        res *= i;
    }
    
    return res;
}

function nCk(n, k)
{
    return nPk(n, k) / factorial(k);
}

function exact(n, k, p)
{
    return nCk(n, k) * Math.pow(p, k) * Math.pow(p, n - k);
}

function at_least(n, k, p)
{
    let res = 0;
    
    if (k > n / 2)
    {
        for (let i = k; i <= n; i++)
        {
            res -= exact(n, k, p);
        }
    }
    else
    {
        res = 1;
        
        for (let i = 0; i <= k; i++)
        {
            res -= exact(n, k, p);
        }
    }

    return res;
}

function at_most(n, k, p)
{
    return 1 - at_least(n, k + 1, p);
}

window.onload = () => {
    inp = document.getElementById('inp');
    oup = document.getElementById('oup');
}

function all_clear()
{
    oup.innerHTML = '0';
    inp.value = '0';
}

function del()
{
    const s = inp.value;
    inp.value = s.substring(0, s.length - 1);
}

function key_in(value)
{
    if (inp.value == '0' && value != '.')
        inp.value = value;
    else
        inp.value += value;
}

function change_keyset()
{
    const keyset_1 = document.getElementById('keyset_1');
    const keyset_2 = document.getElementById('keyset_2');
    
    if (keyset_1.hidden)
    {
        keyset_1.hidden = false;
        keyset_2.hidden = true;
    }
    else
    {
        keyset_1.hidden = true;
        keyset_2.hidden = false;
    }
}

function store()
{
    if (str)
    {
        mem = str;
    }
}

function recall()
{
    if (mem)
    {
        if (inp.value == '0')
            inp.value = mem;
        else
            inp.value += mem;
    }
}

function compute()
{
    try
    {
        str = inp.value;
        prepare();
        pair_braces();
        oup.innerHTML = calculate(str).toString();
    }
    catch (err)
    {
        console.error(err);
    }
}

function prepare()
{
    if (str.length < 2) {
        return;
    }
    
    for (let i = 1; i < str.length; i++)
    {
        if (POSTS.includes(str[i]) && PRES.includes(str[i - 1]) ||
            NUMERIC.includes(str[i]) && (NUMERIC_SYMBOLS + ')').includes(str[i - 1]) ||
            NUMERIC_SYMBOLS.includes(str[i]) && NUMERIC.includes(str[i - 1]))
        {
            str = str.splice(i, 0, '*');
            i++;
        }

        if (str[i] == '.' && !DIGITS.includes(str[i - 1]))
        {
            str = str.splice(i, 0, '0');
        }
    }
}

function pair_braces()
{
    let ob_count;
    let last_ob_count = str.split('(').length - 1;
    
    do
    {
        let ob = -1;        
        ob_count = last_ob_count;
        
        for (let i = 0; i < str.length; i++)
        {
            if (str[i] == '(')
            {
                ob = i;
                continue;
            }
            if (str[i] == ')')
            {
                if (ob == -1)
                {
                    throw Error('no open brace');
                }
                else
                {
                    ob_count--;
                    const sub = str.substring(ob + 1, i);

                    if (str[ob - 1] == '√')
                    {
                        let tmp = '';
                        
                        for (let i = 2; NUMERIC.includes(str[ob - i]); i++)
                        {
                            tmp += str[ob - i];
                        }
                        
                        if (tmp.length != 0)
                        {
                            str = str.splice(ob - 1, i + 1, (calculate(tmp) * Math.pow(calculate(sub), 0.5)).toString());
                        }
                        else
                        {
                            str = str.splice(ob - 1, i + 1, Math.pow(calculate(sub),0.5).toString());
                        }
                    }
                    else if (FUNS_P.includes(str.substring(ob - 4, ob)))
                    {
                        str = str.splice(ob - 4, i + 1, func_p(str.substring(ob - 4, ob), sub).toString());
                    }
                    else if (FUNS_6.includes(str.substring(ob - 6, ob)))
                    {
                        str = str.splice(ob - 6, i + 1, func(str.substring(ob - 6, ob), sub).toString());
                    }
                    else if (FUNS_3.includes(str.substring(ob - 3, ob)))
                    {
                        str = str.splice(ob - 3, i + 1, func(str.substring(ob - 3, ob), sub).toString());
                    }
                    else
                    {
                        const res = calculate(sub),
                              last_lg = str.lastIndexOf('log', ob - 1),
                              last_ob = str.lastIndexOf('(', ob - 1);
                        if (last_lg > last_ob)
                        {
                            const lg = calculate(str.substring(last_lg + 3, ob - 1));
                            str = str.splice(last_lg, i - last_lg + 1, (Math.log(res) / Math.log(lg)).toString());
                        }
                        else
                        {
                            str = str.splice(ob, i - ob + 1, res.toString());
                        }
                    }
                }
                break;
            }
        }
    } while (ob_count != last_ob_count);  
}

function to_array(s)
{
    const arr1 = s.split(NUMBERS);
    const arr2 = [];

    for (let elm of arr1)
    {
        if (elm != '')
        {
            arr2.push(elm);
        }
    }

    return arr2;
}

function calculate(s)
{
    const arr = to_array(s);

    for (let i = 0; i < arr.length; i++)
    {
        switch (arr[i])
        {
            case '-π':
                arr[i] = (-Math.PI).toString();
                break;
            case 'π':
                arr[i] = Math.PI.toString();
                break;
            case '-e':
                arr[i] = (-Math.E).toString();
                break;
            case'e':
                arr[i] = Math.E.toString();
        }
    }

    for (let i = 1; i < arr.length; i++)
    {
        if (arr[i] == 'C' || arr[i] == 'P')
        {
            switch(arr[i])
            {
                case 'C':
                    arr.splice(i - 1, 3, nCk(parseFloat(arr[i - 1]), parseFloat(arr[i + 1])).toString());
                break;
                    case 'P':
                    arr.splice(i - 1, 3, nPk(parseFloat(arr[i - 1]), parseFloat(arr[i + 1])).toString());
            }
            i--;
        }
    }
    
    for (let i = 1; i < arr.length; i++)
    {
        if (arr[i] == '!')
        {
            arr.splice(i - 1, 2, (factorial(parseFloat(arr[i-1]))).toString());
            i--;
        }
    }

    for (let i = 1; i < arr.length; i++)
    {
        if (arr[i] == '^')
        {
            arr.splice(i - 1, 3, Math.pow(parseFloat(arr[i-1]), parseFloat(arr[i+1])).toString());
            i--;
        }
    }

    for (let i = 1; i < arr.length; i++)
    {
        switch (arr[i])
        {
            case '*':
                arr.splice(i - 1, 3, (parseFloat(arr[i-1]) * parseFloat(arr[i+1])).toString());
                i--;
                break;
            case '/':
                arr.splice(i - 1, 3, (parseFloat(arr[i-1]) / parseFloat(arr[i+1])).toString());
                i--;
                break;
            case '%':
                arr.splice(i - 1, 3, (parseFloat(arr[i-1]) % parseFloat(arr[i+1])).toString());
                i--;
        }
    }
    
    for (let i = 1; i < arr.length; i++)
    {
        if (i == 0)
        {
            i++;
        }
        
        if (arr[i] == '+')
        {
            arr.splice(i - 1, 3, (parseFloat(arr[i - 1]) + parseFloat(arr[i + 1])).toString());
            i -= 2;
        }
        
        if (arr[i] == '-')
        {
            arr.splice(i - 1, 3, (parseFloat(arr[i - 1]) - parseFloat(arr[i + 1])).toString());
            i -= 2;
        }
        
        if (parseFloat(arr[i]) < 0)
        {
            arr.splice(i - 1, 2, (parseFloat(arr[i - 1]) + parseFloat(arr[i])).toString());
            i -= 2;
        }
    }
    
    return parseFloat(arr[0]);
}

function func(fun, s)
{
    const res = calculate(s);
    
    switch (fun)
    {
        case 'log':
            return Math.log(res);
        case 'sin':
            return Math.sin(res / 180 * Math.PI);
        case 'cos':
            return Math.cos(res / 180 * Math.PI);
        case 'tan':
            return Math.tan(res / 180 * Math.PI);
        case 'arcsin':
            return Math.asin(res) * 180 / Math.PI;
        case 'arccos':
            return Math.acos(res) * 180 / Math.PI;
        case 'arctan':
            return Math.atan(res) * 180 / Math.PI;
    }
    
    return 0;
}

function func_p(fun, s)
{
    const inputs = s.split(',').map(Number);
    
    switch (fun)
    {
        case 'Px==':
            return exact(inputs[0], inputs[1], inputs[2]);
        case 'PX<=':
            return at_most(inputs[0], inputs[1], inputs[2]);
        case 'PX>=':
            return at_least(inputs[0], inputs[1], inputs[2]);
    }
    
    return 0;
}
