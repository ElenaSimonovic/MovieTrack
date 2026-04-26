<template>
  <q-page class="page-detail">
    <div class="content q-pa-lg">
      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Povratak"
        @click="$router.push('/pretraga-filmova')"
        color="secondary"
        class="back-btn q-mb-lg"
      />

      <q-card v-if="movie" class="movie-detail-card shadow-24">
        <div class="hero-section row items-center q-pa-xl q-gutter-lg">
          <div class="detail-icon-container shadow-10">
            <q-icon name="movie_filter" size="100px" color="white" />
          </div>

          <div class="column">
            <div class="text-h2 text-bold text-white leading-tight">
              {{ movie.Naziv_filma }}
            </div>

            <div class="row q-gutter-sm q-mt-sm">
              <q-badge
                v-for="g in (movie.Zanr_filma ? movie.Zanr_filma.split(',') : [])"
                :key="g"
                color="orange-10"
                class="q-pa-sm text-subtitle2"
              >
                {{ g.trim() }}
              </q-badge>
            </div>
          </div>
        </div>

        <q-card-section class="q-pa-xl bg-white text-grey-9">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4">
              <div class="info-card">
                <q-icon name="event" color="primary" size="sm" />
                <div class="q-ml-md">
                  <div class="info-label">Godina proizvodnje</div>
                  <div class="info-value text-weight-bolder">
                    {{ formatYear(movie.Godina_proizvodnje) }}.
                  </div>
                </div>
              </div>

              <div class="info-card q-mt-md">
                <q-icon name="translate" color="primary" size="sm" />
                <div class="q-ml-md">
                  <div class="info-label">Jezik filma</div>
                  <div class="info-value text-weight-bolder">
                    {{ movie.Jezik_filma }}
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <q-btn
                unelevated
                color="primary"
                icon="add_circle"
                label="Dodaj u moju listu"
                class="full-width q-py-md text-weight-bold q-mb-md"
                @click="addToMyList"
              />

              <q-btn
                outline
                color="orange-10"
                icon="rate_review"
                label="Ostavi recenziju"
                class="full-width q-py-md text-weight-bold"
                @click="openCommentDialog"
              />
            </div>

            <div class="col-12 col-md-8">
              <div class="row items-center q-mb-md">
                <q-icon name="notes" color="primary" size="sm" class="q-mr-sm" />
                <div class="text-h5 text-weight-bold">Sadržaj filma</div>
              </div>
              <p class="movie-description q-mb-xl">
                {{ movie.Opis_filma }}
              </p>

              <q-separator class="q-mb-xl" />

              <div class="comments-section">
                <div class="row items-center q-mb-lg">
                  <q-icon name="forum" color="primary" size="sm" class="q-mr-sm" />
                  <div class="text-h5 text-weight-bold">Komentari gledatelja</div>
                </div>

                <div v-if="comments.length > 0">
  <q-card flat bordered v-for="c in comments" :key="c.id_komentara" class="q-mb-md comment-card">
    <q-card-section>
      <div class="row justify-between items-center">
        <div>
          <span class="text-weight-bold text-primary">{{ c.Email_korisnika }}</span>
          <q-badge v-if="getCurrentUser()?.Email === c.Email_korisnika" color="blue-2" text-color="blue-9" class="q-ml-sm">Ti</q-badge>
        </div>
        <div class="row items-center q-gutter-xs">
          <div class="text-caption text-grey q-mr-sm">{{ formatDate(c.Datum_i_vrijeme_objave) }}</div>

          <template v-if="getCurrentUser()?.Email === c.Email_korisnika">
            <q-btn flat round dense color="blue-7" icon="edit" size="sm" @click="prepareEdit(c)">
              <q-tooltip>Uredi komentar</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteComment(c.id_komentara)">
              <q-tooltip>Obriši komentar</q-tooltip>
            </q-btn>
          </template>
        </div>
      </div>

      <q-rating
        v-model="c.Ocjena"
        size="18px"
        color="orange"
        readonly
        class="q-my-xs"
      />
      <div class="text-body1">{{ c.Sadrzaj_komentara }}</div>
    </q-card-section>
  </q-card>
</div>

                <div v-else class="column items-center q-pa-xl bg-grey-1 rounded-borders border-dashed">
                  <q-icon name="chat_bubble_outline" size="xl" color="grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">Tišina u dvorani...</div>
                  <div class="text-subtitle1 text-grey-5">Budi prvi koji će podijeliti dojmove o ovom filmu!</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div v-else class="column flex-center q-mt-xl">
        <q-spinner-dots color="primary" size="5em" />
        <div class="text-h6 text-grey-6 q-mt-md">Učitavanje podataka...</div>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 350px" class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Odaberi listu</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedList"
            :options="lists"
            option-label="Naziv_liste"
            option-value="id_osobne_liste"
            emit-value
            map-options
            outlined
            label="Moje liste"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="primary" label="Dodaj" @click="confirmAddToList" :disable="!selectedList" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="commentDialog">
      <q-card style="min-width: 400px" class="q-pa-md">
        <q-card-section class="row items-center">
          <div class="text-h6">Tvoj dojam o filmu</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="column q-gutter-md">
          <div class="text-subtitle2">Ocjena filma:</div>
          <q-rating
            v-model="newComment.ocjena"
            size="2.5em"
            color="orange"
            icon="star_border"
            icon-selected="star"
          />

          <q-input
            v-model="newComment.sadrzaj"
            type="textarea"
            outlined
            label="Napiši komentar..."
            counter
            maxlength="200"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn
            color="primary"
            label="Objavi komentar"
            @click="submitComment"
            :loading="loadingComment"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const movie = ref(null);
const lists = ref([]);
const selectedList = ref(null);
const dialog = ref(false);

// Komentari state
const comments = ref([]);
const commentDialog = ref(false);
const loadingComment = ref(false);
const newComment = ref({
  sadrzaj: '',
  ocjena: 3
});

const isEditing = ref(false);
const editingCommentId = ref(null);

// Provjera korisnika
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (!user || user === "null") return null;
  return JSON.parse(user);
};

const fetchLists = async () => {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const res = await axios.get(`http://localhost:4200/lista/user/${user.Email}`);
    lists.value = res.data;
  } catch (e) { console.error(e); }
};

const fetchMovieDetail = async () => {
  try {
    const filmNaziv = route.params.naziv;
    const res = await axios.get(`http://localhost:4200/film/${filmNaziv}`);
    movie.value = Array.isArray(res.data) ? res.data[0] : res.data;
    if (movie.value) fetchComments();
  } catch (err) { console.error(err); }
};

// DOHVATI KOMENTARE
const fetchComments = async () => {
  try {
    const res = await axios.get(`http://localhost:4200/komentar/${movie.value.Naziv_filma}`);
    comments.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju komentara:", err);
  }
};

const addToMyList = () => {
  if (!getCurrentUser()) {
    showLoginNotify();
    return;
  }
  dialog.value = true;
};



// Funkcija za otvaranje dijaloga za NOVI komentar
const openCommentDialog = () => {
  if (!getCurrentUser()) {
    showLoginNotify();
    return;
  }
  isEditing.value = false;
  editingCommentId.value = null;
  newComment.value = { sadrzaj: '', ocjena: 3 };
  commentDialog.value = true;
};

// Priprema za EDIT (popunjava dijalog postojećim podacima)
const prepareEdit = (comment) => {
  isEditing.value = true;
  editingCommentId.value = comment.id_komentara;
  newComment.value = {
    sadrzaj: comment.Sadrzaj_komentara,
    ocjena: comment.Ocjena
  };
  commentDialog.value = true;
};

// UNIVERZALNI SUBMIT (Post ili Put)
const submitComment = async () => {
  if (!newComment.value.sadrzaj) {
    $q.notify({ type: 'warning', message: 'Napišite tekst komentara!' });
    return;
  }

  const user = getCurrentUser();
  loadingComment.value = true;

  try {
    if (isEditing.value) {
      // (Ažuriranje)
      await axios.put(`http://localhost:4200/komentar/${editingCommentId.value}`, {
        sadrzaj: newComment.value.sadrzaj,
        ocjena: newComment.value.ocjena
      });
      $q.notify({ type: 'positive', message: 'Komentar ažuriran!' });
    } else {
      // novi komentar
      await axios.post('http://localhost:4200/komentar', {
        email: user.Email,
        film: movie.value.Naziv_filma,
        sadrzaj: newComment.value.sadrzaj,
        ocjena: newComment.value.ocjena
      });
      $q.notify({ type: 'positive', message: 'Hvala na recenziji!' });
    }

    commentDialog.value = false;
    fetchComments(); // Osvježi listu
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Greška prilikom spremanja.' });
  } finally {
    loadingComment.value = false;
  }
};

// BRISANJE KOMENTARA
const deleteComment = (id) => {
  $q.dialog({
    title: 'Potvrda brisanja',
    message: 'Jesi li siguran da želiš trajno obrisati ovaj komentar?',
    cancel: true,
    persistent: true,
    ok: { label: 'Obriši', color: 'negative', flat: true },
    cancel: { label: 'Odustani', color: 'primary', flat: true }
  }).onOk(async () => {
    try {
      await axios.delete(`http://localhost:4200/komentar/${id}`);
      $q.notify({ type: 'positive', message: 'Komentar uspješno obrisan.', icon: 'delete' });
      fetchComments(); // Osvježi listu
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Greška pri brisanju.' });
    }
  });
};

const confirmAddToList = async () => {
  try {
    await axios.post('http://localhost:4200/lista/film', {
      id_osobne_liste: selectedList.value,
      nazivFilma: movie.value.Naziv_filma
    });
    $q.notify({ type: 'positive', message: 'Film dodan u listu!' });
    dialog.value = false;
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Greška pri dodavanju.' });
  }
};



const showLoginNotify = () => {
  $q.notify({
    type: 'negative',
    message: 'Potrebna prijava!',
    caption: 'Morate biti prijavljeni za ovu akciju.',
    actions: [{ label: 'Prijavi se', color: 'white', handler: () => router.push('/login') }]
  });
};




const formatYear = (d) => d ? new Date(d).getFullYear() : "N/A";
const formatDate = (d) => new Date(d).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' });

onMounted(() => {
  fetchMovieDetail();
  fetchLists();
});
</script>

<style scoped>
/* Tvoji postojeći stilovi + dodaci za komentare */
.page-detail {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
.content { max-width: 1100px; margin: 0 auto; }
.movie-detail-card { border-radius: 20px !important; overflow: hidden; }
.hero-section { background: linear-gradient(to right, #243b55, #141e30); min-height: 250px; }
.detail-icon-container { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2); }
.info-card { display: flex; align-items: center; background: #fdfdfd; padding: 16px; border-radius: 12px; border: 1px solid #edf2f7; }
.info-label { font-size: 0.75rem; color: #a0aec0; text-transform: uppercase; font-weight: bold; }
.movie-description { font-size: 1.1rem; line-height: 1.8; color: #4a5568; }

/* Novi stilovi */
.comment-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}
.comment-card:hover {
  border-color: #3b82f6;
  background-color: #fafbff;
}
.border-dashed {
  border: 2px dashed #e2e8f0;
  border-radius: 15px;
}
</style>
