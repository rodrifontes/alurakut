import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
//importanto os componentes individualmente
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />

      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.login}.png`}>
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
      </ul>

    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUser = 'rodrifontes';
  //React.useState(['AluraKu']) retorna duas coisas, a primeira o valor do array e a segunda uma função 
  const [comunidades, setComunidades] = React.useState([
    /* {
    id: new Date().toISOString(),
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  } */
  ]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    //'guilhermesilveira'
  ];

  const [seguidores, setSeguidores] = React.useState([]);
  //Interceptador de qualquer evento que venha a acontecer
  //O segundo par é um array de quando eu quero q ele execute, quando eu deixar vazio ele vai executar só 1 vez
  //poderia botar uma variavel que quando ela fosse alterada ele executasse
  React.useEffect(function () {
    // 1 - Pegar o array de dados do github
    fetch('https://api.github.com/users/omariosouto/followers')
      //GET  
      .then((respostaDoServidor) => {
        if (respostaDoServidor.ok) {
          return respostaDoServidor.json();
        }
        throw new Error('Aconteceu algum problema: ' + respostaDoServidor.status)
      })
      .then((respostaConvertida) => {
        setSeguidores(respostaConvertida);
      })
    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      //Por padrão é GET por isso que no outro fetch não especifiquei
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': '2008473fec078db3a393ebd463e07d'
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            id,
            title,
            imageUrl,
            creatorSlug
          }
        }`}),
    })
      .then((response) => response.json()) //Pega o retorno do response.json e já retorna
      .then((respostaCompleta => {
        setComunidades(respostaCompleta.data.allCommunities);
      }))
  }, []);
  // 2 - Criar um box que vai ter um map, baseado nos itens do array do github 

  return (
    <>

      <AlurakutMenu />

      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a), {githubUser}
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriarComunidade(e) {
              //Previno o comportamento padrão
              e.preventDefault();
              //Pega os dados do formulario e tras p gente nesse retorno
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',

                },
                body: JSON.stringify(comunidade)


              })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar Comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Amigos" items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

        </div>

      </MainGrid>

    </>
  );
}
