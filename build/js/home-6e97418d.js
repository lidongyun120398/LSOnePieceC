import {
  d as e,
  r as t,
  t as a,
  i as s,
  j as l,
  k as i,
  o as n,
  c as r,
  b as u,
  n as f,
  F as v,
  l as o,
  m as d,
  _ as c,
  e as h,
  q as m,
} from "./main-06eee04b.js";
const p = c(
    e({
      __name: "VirtualList",
      props: { listData: { default: () => [] }, itemSize: { default: 100 } },
      setup(e) {
        const c = e,
          h = t({ screenHeight: 0, startOffset: 0, start: 0, end: null }),
          { listData: m, itemSize: p } = a(c),
          g = s(() => m.value.length * p.value),
          _ = s(() => Math.ceil(h.screenHeight / p.value)),
          x = s(() => `translate3d(0,${h.startOffset}px,0)`),
          y = s(() => m.value.slice(h.start, Math.min(h.end, m.value.length))),
          H = l();
        return (
          i(() => {
            (h.screenHeight = H.value.clientHeight), (h.start = 0), (h.end = h.start + _.value);
          }),
          (e, t) => (
            n(),
            r(
              "div",
              {
                ref_key: "listRef",
                ref: H,
                class: "infinite-list-container",
                onScroll:
                  t[0] ||
                  (t[0] = (e) =>
                    (() => {
                      let e = H.value.scrollTop;
                      (h.start = Math.floor(e / p.value)),
                        (h.end = h.start + _.value),
                        (h.startOffset = e - (e % p.value));
                    })()),
              },
              [
                u("div", { class: "infinite-list-phantom", style: f({ height: g.value + "px" }) }, null, 4),
                u(
                  "div",
                  { class: "infinite-list", style: f({ transform: x.value }) },
                  [
                    (n(!0),
                    r(
                      v,
                      null,
                      o(
                        y.value,
                        (e) => (
                          n(),
                          r(
                            "div",
                            {
                              ref_for: !0,
                              ref: "items",
                              key: e.id,
                              class: "infinite-list-item",
                              style: f({ height: c.itemSize + "px", lineHeight: c.itemSize + "px" }),
                            },
                            d(e.value),
                            5,
                          )
                        ),
                      ),
                      128,
                    )),
                  ],
                  4,
                ),
              ],
              544,
            )
          )
        );
      },
    }),
    [["__scopeId", "data-v-f412b04d"]],
  ),
  g = { class: "home" },
  _ = e({
    __name: "home",
    setup(e) {
      const t = l([]);
      return (
        i(() => {
          for (let e = 0; e < 1e5; e++) t.value.push({ id: e, value: e });
        }),
        (e, a) => (n(), r("div", g, [h(m(p), { "list-data": t.value }, null, 8, ["list-data"])]))
      );
    },
  });
export { _ as default };
