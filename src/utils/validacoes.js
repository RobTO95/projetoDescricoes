const regexValidacoes = [
    {
        grupo: "1001",
        regex: /^(CABO)\s([A-Z]+|([A-Z]+\s[A-Z]+))\s(\d+°C)\s([0-9\,]+(MM2|AWG))\s((([A-Z]{2}\/)+)?[A-Z]{2})\s([0-9\/]+V)(\s[\sA-Z0-9(),\-]+)?((\s[A-Z0-9\-\s]+)?)$/,
    },
    {
        grupo: "1002",
        regex: /^(CABO)\s([A-Z]+|([A-Z]+\s[A-Z]+))\s(\d+°C)\s([0-9\,]+(MM2|AWG))\s((([A-Z]{2}\/)+)?[A-Z]{2})\s([0-9\/]+V)(\s[\sA-Z0-9(),\-]+)?((\s[A-Z0-9\-\s]+)?)$/,
    },
    {
        grupo: "1003",
        regex: /^(CABO)\s([A-Z]+|([A-Z]+\s[A-Z]+))\s(\d+°C)\s([0-9\,X]+(MM2|AWG))\s((([A-Z]{2}\/)+)?[A-Z]{2})\s([0-9\/]+V)(\s[\sA-Z0-9(),\-]+)?((\s[A-Z0-9\-\s]+)?)$/,
    },
    {
        grupo: "1004",
        regex: /^(CABO)\s([A-Z]+|([A-Z]+\s[A-Z]+))\s(\d+°C)\s([0-9\,X]+(MM2|AWG))\s(((([A-Z]{2}\/)+)?[A-Z]{2})|([0-9A-Z\s\/]+))\s([0-9\/]+V)(\s[\sA-Z0-9(),\-]+)?((\s[A-Z0-9\-\s]+)?)$/,
    },
    {
        grupo: "1008",
        regex: /(^(TERM. FASTON)\s([\d+\,]+X[\d+\,]+)\s+([\d+\,-]+(MM2|AWG))\s([A-Z]+)\s([A-Z\/]+)\s([A-Z]+)(\s[A-Z0-9\,\/]+)?((\s[A-Z0-9\.\s\-]+)?)$)/,
    },
    {
        grupo: "1011",
        regex: /^(ETIQUETA|MARCADOR)/,
    },
    {
        grupo: "1012",
        regex: /(^(TUBO ISOLANTE)\s(\d+,\d{2}X\d+,\d{2})\s([A-Z]{2})\s(\d+°C)\s([0-9\,]+KV)\s([A-Z]+)(\s[A-Z0-9\s\/]+)?((\s[A-Z0-9\-\s]+)?)$|^(TUBO CORRUGADO)\s([0-9\/\.]+POL)\s(\d+,\d{2})\s([A-Z]{2})\s(\d+°C)\s([A-Z]+)\s([A-Z0-9,.\/\s]+)((\s[A-Z0-9\s]+)?([A-Z0-9\s\-]+)?)$)/,
    },
    {
        grupo: "1013",
        regex: /^TERMOENCOLHIVEL\s(\d+,\d{2}X\d+,\d{2})\s([0-9-\/.]+)POL\s([0-9\,()]+)\s(([A-Z]{2})|([A-Z\/]+))\s+([0-9]+(º|°)C)\s([A-Z\d+\s]+)(\s[A-Z-0-9\s,]+$)?\s((([A-Z0-9]+-[A-Z0-9]+)|([A-Z0-9]+))?)$/,
    },
    {
        grupo: "1015",
        regex: /^(PRENSA CABO)\s([A-Z]+)\s([A-Z0-9,.\/]+)\s([\d+,]+)\s([(][0-9,]+MM-[0-9,]+MM[)])\s((?!UL\b)[A-Z]{2}|[A-Z\/]{5})(\s[A-Z0-9,.]+)?(\s([A-Z0-9\s\-]+?(-[A-Z0-9\/]+)?))?$/,
    },
    {
        grupo: "1016",
        regex: /(^RESISTOR)\s([0-9,]+[A-Z]?)\s([0-9,]+W)\s(±\d+%)\s([A-Z\/]+)(\s[A-Z0-9\s]+)?(\s[A-Z0-9\-\s]+)?$/,
    },
    {
        grupo: "1025",
        regex: /(^TERMISTOR)\s([A-Z]+)\s+([\d,]+°C)\s([A-Z\-]+)\s(\d+)\s(SENSOR|SENSORES)\s(\d+)\s(CABO|CABOS)(\s[A-Z0-9\s]+)?(\s[A-Z0-9\-]+)?$/,
    },
    {
        grupo: "1050",
        regex: /((^TERMOENCOLHIVEL)\s(\d+,\d{2}X\d+,\d{2})\s([0-9\/]+POL)\s(\([0-9\,]+\))\s([A-Z]{2})\s(\d+°C)\s([A-Z]+)(\s[A-Z0-9,\s]+)?(\s[A-Z0-9\-\s]+)?$|(^TUBO ISOLANTE)\s(\d+,\d{2}X\d+,\d{2})\s([A-Z]{2})\s(\d+°C)\s([\d+,]+[A-Z]?V)\s([A-Z\/]+)(\s[A-Z0-9\s,\/]+)?(\s[A-Z0-9\-\s]+)?$)/,
    },
];

export function validarDescricaoPorGrupo(descricao, grupo) {
    const regra = regexValidacoes.find((r) => r.grupo === grupo);
    return regra ? regra.regex.test(descricao) : false;
}
