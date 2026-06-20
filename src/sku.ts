export interface SKUObject {
  defindex: number;
  quality: number;
  craftable: boolean;
  tradable: boolean;
  killstreak: number;
  australium: boolean;
  effect: number | null;
  festive: boolean;
  paintkit: number | null;
  wear: number | null;
  quality2: number | null;
  craftnumber: number | null;
  crateseries: number | null;
  target: number | null;
  output: number | null;
  outputQuality: number | null;
  paint: number | null;
}

const TEMPLATE: SKUObject = {
  defindex: 0,
  quality: 0,
  craftable: true,
  tradable: true,
  killstreak: 0,
  australium: false,
  effect: null,
  festive: false,
  paintkit: null,
  wear: null,
  quality2: null,
  craftnumber: null,
  crateseries: null,
  target: null,
  output: null,
  outputQuality: null,
  paint: null,
};

function isNum(test: string): boolean {
  return /^-?\d+$/.test(test);
}

function prettify(obj: Partial<SKUObject>): SKUObject {
  const result = {} as any;
  for (const key of Object.keys(TEMPLATE) as Array<keyof SKUObject>) {
    result[key] =
      obj[key] !== undefined && obj[key] !== null ? obj[key] : TEMPLATE[key];
  }
  return result as SKUObject;
}

export class SKU {
  static fromString(sku: string): SKUObject {
    const attributes: Partial<SKUObject> = {};

    const parts = sku.split(";");
    const partsCount = parts.length;

    if (partsCount > 0) {
      const first = parts.shift();
      if (first !== undefined && isNum(first)) {
        attributes.defindex = parseInt(first, 10);
      }
    }

    if (parts.length > 0) {
      const second = parts.shift();
      if (second !== undefined && isNum(second)) {
        attributes.quality = parseInt(second, 10);
      }
    }

    for (let i = 0; i < parts.length; i++) {
      const attribute = parts[i].replace(/-/g, "");

      if (attribute === "uncraftable") {
        attributes.craftable = false;
      } else if (attribute === "untradeable" || attribute === "untradable") {
        attributes.tradable = false;
      } else if (attribute === "australium") {
        attributes.australium = true;
      } else if (attribute === "festive") {
        attributes.festive = true;
      } else if (attribute === "strange") {
        attributes.quality2 = 11;
      } else if (attribute.startsWith("kt") && isNum(attribute.substring(2))) {
        attributes.killstreak = parseInt(attribute.substring(2), 10);
      } else if (attribute.startsWith("u") && isNum(attribute.substring(1))) {
        attributes.effect = parseInt(attribute.substring(1), 10);
      } else if (attribute.startsWith("pk") && isNum(attribute.substring(2))) {
        attributes.paintkit = parseInt(attribute.substring(2), 10);
      } else if (attribute.startsWith("w") && isNum(attribute.substring(1))) {
        attributes.wear = parseInt(attribute.substring(1), 10);
      } else if (attribute.startsWith("td") && isNum(attribute.substring(2))) {
        attributes.target = parseInt(attribute.substring(2), 10);
      } else if (attribute.startsWith("n") && isNum(attribute.substring(1))) {
        attributes.craftnumber = parseInt(attribute.substring(1), 10);
      } else if (attribute.startsWith("c") && isNum(attribute.substring(1))) {
        attributes.crateseries = parseInt(attribute.substring(1), 10);
      } else if (attribute.startsWith("od") && isNum(attribute.substring(2))) {
        attributes.output = parseInt(attribute.substring(2), 10);
      } else if (attribute.startsWith("oq") && isNum(attribute.substring(2))) {
        attributes.outputQuality = parseInt(attribute.substring(2), 10);
      } else if (attribute.startsWith("p") && isNum(attribute.substring(1))) {
        attributes.paint = parseInt(attribute.substring(1), 10);
      }
    }

    return prettify(attributes);
  }

  static fromObject(item: Partial<SKUObject>): string {
    const fullItem = prettify(item);

    let sku = `${fullItem.defindex};${fullItem.quality}`;

    if (fullItem.effect !== null && fullItem.effect !== undefined) {
      sku += `;u${fullItem.effect}`;
    }
    if (fullItem.australium === true) {
      sku += ";australium";
    }
    if (fullItem.craftable === false) {
      sku += ";uncraftable";
    }
    if (fullItem.tradable === false) {
      sku += ";untradable";
    }
    if (fullItem.wear !== null && fullItem.wear !== undefined) {
      sku += `;w${fullItem.wear}`;
    }
    if (typeof fullItem.paintkit === "number") {
      sku += `;pk${fullItem.paintkit}`;
    }
    if (fullItem.quality2 === 11) {
      sku += ";strange";
    }
    if (typeof fullItem.killstreak === "number" && fullItem.killstreak !== 0) {
      sku += `;kt-${fullItem.killstreak}`;
    }
    if (fullItem.target !== null && fullItem.target !== undefined) {
      sku += `;td-${fullItem.target}`;
    }
    if (fullItem.festive === true) {
      sku += ";festive";
    }
    if (fullItem.craftnumber !== null && fullItem.craftnumber !== undefined) {
      sku += `;n${fullItem.craftnumber}`;
    }
    if (fullItem.crateseries !== null && fullItem.crateseries !== undefined) {
      sku += `;c${fullItem.crateseries}`;
    }
    if (fullItem.output !== null && fullItem.output !== undefined) {
      sku += `;od-${fullItem.output}`;
    }
    if (
      fullItem.outputQuality !== null &&
      fullItem.outputQuality !== undefined
    ) {
      sku += `;oq-${fullItem.outputQuality}`;
    }
    if (fullItem.paint !== null && fullItem.paint !== undefined) {
      sku += `;p${fullItem.paint}`;
    }

    return sku;
  }
}
