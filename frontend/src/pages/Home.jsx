import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen font-mono">
      <div className="relative flex justify-between h-20 pt-5 py-3 px-10 text-2xl items-center shadow shadow-amber-50">
        <span>PgHub</span>
        <button
          onClick={() => {
            navigate('/userLogin');
          }}
          className="bg-red-700 rounded py-1 px-3 cursor-pointer"
        >
          Login
        </button>

        {/* <IoMenu color="white" className="cursor-pointer"/> */}
      </div>
      <div className="p-5 text-xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae obcaecati
        nemo non quas perferendis doloremque voluptatum tempore temporibus eos
        itaque! Sint laudantium minima odio repellendus rerum libero at facilis
        quo! Ipsum sint eius, quas optio asperiores quisquam. Id earum suscipit
        non, impedit reiciendis nisi excepturi facilis. Perspiciatis, blanditiis
        hic dignissimos, praesentium animi eos voluptatum assumenda cumque
        excepturi veniam sed cupiditate? In cum sint ea alias repudiandae
        consequatur porro. Officia similique nobis consequuntur, voluptas
        quisquam labore id ea asperiores odit quasi quia. Ipsam, dolor sunt
        quisquam ex officia explicabo labore soluta. Nemo alias adipisci
        mollitia voluptas, commodi aliquid aut nobis harum illo, dolore nostrum
        culpa assumenda. Molestias adipisci in cumque esse. Consectetur neque
        unde quae aspernatur commodi tempora, delectus sequi nam. Exercitationem
        quos nobis esse laboriosam natus eligendi, adipisci eius, veritatis
        dolor reiciendis, minus illum. Modi fugiat non, ad totam id voluptatum
        numquam nemo molestias earum corrupti officiis ratione suscipit quaerat.
        Quasi laborum commodi sint delectus fugiat non rerum. Quaerat, alias
        modi eligendi cum aperiam sapiente, debitis suscipit, fugiat est dolor
        enim itaque tempora similique in porro optio distinctio. Architecto,
        perferendis? Quasi perferendis tenetur ducimus distinctio numquam, nulla
        laboriosam eaque esse voluptate ipsa iusto incidunt quisquam
        consequuntur placeat inventore aliquam totam. Suscipit minus, asperiores
        odit nisi dolorum nam veritatis doloribus nihil? Quae officia animi
        voluptate, eos culpa ea tempore odio ullam reprehenderit fugiat laborum
        vero et doloremque itaque modi voluptatibus accusamus, quas placeat ab
        delectus, nesciunt magni dolores accusantium eligendi. Porro. Totam
        debitis, repudiandae dicta earum officia a nihil nesciunt libero
        sapiente amet molestiae quam, ipsa similique enim aliquid accusantium
        rerum commodi fuga in laudantium deserunt. Excepturi fuga delectus
        doloribus est! Cum amet eaque maxime nemo esse sint voluptatem
        consectetur non mollitia ducimus at obcaecati pariatur placeat,
        laudantium, veritatis iure, qui velit doloremque possimus fuga ex? Id
        nulla quis molestias harum? Repudiandae animi adipisci molestiae quidem
        reiciendis, ipsam vel natus numquam, molestias facere alias iure velit?
        Fugiat debitis quod nam nisi saepe, nulla dolores architecto deleniti
        sequi quos praesentium cupiditate vitae. Excepturi sint porro nostrum
        iure animi possimus laudantium officia, culpa quos amet aliquam ducimus,
        dolor nisi natus temporibus, repellat assumenda et atque. In reiciendis
        a odit alias cumque molestias ratione! Voluptatum debitis aut velit
        inventore dolores ullam autem blanditiis ex facilis ut quaerat nisi
        corrupti molestiae dolorum provident recusandae, eius laudantium vero
        ratione reprehenderit quidem fugiat quisquam incidunt! Dolor, natus.
        Quaerat suscipit nihil repellat officia quam cupiditate? Numquam vitae
        eius dolor voluptatem? Architecto itaque odit suscipit delectus non
        iste, mollitia sunt natus totam voluptatem rerum maxime ut amet sed
        vero! Modi odio, fugiat id sequi sed optio, unde saepe error facere,
        ducimus aspernatur accusantium quasi dignissimos illum corporis!
        Voluptas nisi tempore ullam animi tempora aliquam ipsa rerum iure autem
        similique? Architecto velit, explicabo, soluta molestias ducimus
        voluptate reiciendis placeat recusandae iusto doloribus dicta. Itaque
        vel sint debitis? Soluta itaque labore numquam voluptatem alias,
        distinctio provident perspiciatis omnis modi praesentium doloremque!
        Dolores, illum! Molestiae provident id animi odit. Et molestias, quos
        illum nulla perspiciatis libero. Tempore minus ipsum nostrum nesciunt
        placeat vel ut porro esse, eos sint, id quaerat a? Quas. Reiciendis
        libero dolorum, vero facere porro voluptate enim temporibus illum quas
        sequi! Optio iure earum neque facere architecto culpa quae nihil, sunt,
        autem molestias consectetur dicta commodi est! Totam, ea. Molestiae
        praesentium voluptas facilis soluta illum beatae? Doloribus, qui?
        Voluptas rerum consequuntur, temporibus commodi reiciendis delectus
        repellendus praesentium aut illum voluptate explicabo incidunt
        aspernatur consequatur at, fuga obcaecati. Saepe, sunt! Mollitia
        corrupti sequi animi necessitatibus praesentium inventore eaque vero
        ullam eligendi labore eveniet, assumenda dolores aspernatur ab? Dolorem
        distinctio fugit reiciendis eos autem suscipit, molestias nostrum alias
        possimus dolorum. Repellat?
      </div>
    </div>
  );
};

export default Home;
