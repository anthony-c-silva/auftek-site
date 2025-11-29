// Importe a imagem local
// Certifique-se de que o arquivo "BioAiLabIllustration.png" está dentro da pasta "src/assets/images/"
import labWorkImg from "./images/BioAiLabIlustration.svg";

export const Assets = {
  hero: {
    background: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000",
  },
  about: {
    // Usando a imagem local importada acima
    labWork: labWorkImg,
  },
  solutions: {
    // URLs externas mantidas (você pode substituir por imports locais futuramente)
    solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    microbio: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800",
    arcFlash: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800",
    safety: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
  },
  team: {
    // URLs externas mantidas
    member1: "https://picsum.photos/200/200?random=1",
    member2: "https://picsum.photos/200/200?random=2",
    member3: "https://picsum.photos/200/200?random=3",
    member4: "https://picsum.photos/200/200?random=4",
  }
};