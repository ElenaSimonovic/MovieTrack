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

      <q-card v-if="movie" class="movie-detail-card shadow-24" :dark="$q.dark.isActive">
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

        <q-card-section class="q-pa-xl bg-surface" :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-9'">
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
                class="full-width q-py-md text-weight-bold q-mb-md"
                @click="openCommentDialog"
              />

              <div class="row q-gutter-sm flex-center">
                <q-btn
                  flat
                  round
                  icon="favorite"
                  color="red"
                  @click="addToSpecialList('Favoriti')"
                >
                  <q-tooltip>Dodaj u Favorite</q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  icon="schedule"
                  color="blue"
                  @click="addToSpecialList('Želim gledati')"
                >
                  <q-tooltip>Dodaj u Želim gledati</q-tooltip>
                </q-btn>
              </div>
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
                  <q-card
                    flat
                    bordered
                    v-for="c in comments"
                    :key="c.id_komentara"
                    class="q-mb-md comment-card"
                    :dark="$q.dark.isActive"
                  >
                    <q-card-section>
                      <div class="row justify-between items-center">
                        <div>
                          <span class="text-weight-bold text-primary">{{ c.Email_korisnika }}</span>
                          <q-badge v-if="getCurrentUser()?.email === c.Email_korisnika" :color="$q.dark.isActive ? 'blue-10' : 'blue-2'" :text-color="$q.dark.isActive ? 'white' : 'blue-9'" class="q-ml-sm">Ti</q-badge>
                        </div>
                        <div class="row items-center q-gutter-xs">
                          <div class="text-caption text-grey q-mr-sm">{{ formatDate(c.Datum_i_vrijeme_objave) }}</div>

                          <template v-if="getCurrentUser()?.email === c.Email_korisnika">
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

                <div v-else class="column items-center q-pa-xl rounded-borders border-dashed" :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-1'">
                  <q-icon name="chat_bubble_outline" size="xl" color="grey-7" />
                  <div class="text-h6 text-grey-6 q-mt-md">Tišina u dvorani...</div>
                  <div class="text-subtitle1 text-grey-6">Budi prvi koji će podijeliti dojmove o ovom filmu!</div>
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
      <q-card style="min-width: 350px" class="q-pa-md" :dark="$q.dark.isActive">
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
            :dark="$q.dark.isActive"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="primary" label="Dodaj" @click="confirmAddToList" :disable="!selectedList" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="commentDialog">
      <q-card style="min-width: 400px" class="q-pa-md" :dark="$q.dark.isActive">
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
            :dark="$q.dark.isActive"
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
import { api } from "boot/axios";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const token = localStorage.getItem("token")

const movie = ref(null);
const lists = ref([]);
const selectedList = ref(null);
const dialog = ref(false);

const comments = ref([]);
const commentDialog = ref(false);
const loadingComment = ref(false);
const newComment = ref({
  sadrzaj: '',
  ocjena: 3
});

const isEditing = ref(false);
const editingCommentId = ref(null);

const getCurrentUser = () => {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")

  if (!token || !user) return null

  return JSON.parse(user)
};

const fetchLists = async () => {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const res = await axios.get(`http://localhost:4200/lista/user/${user.email}`);
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

const addToSpecialList = async (nazivListe) => {
  const user = getCurrentUser();
  if (!user) {
    showLoginNotify();
    return;
  }

  try {
    const lista = lists.value.find(l => l.Naziv_liste === nazivListe);

    if (!lista) {
      $q.notify({
        type: 'negative',
        message: `Lista nije pronađena`
      });
      return;
    }

    await api.post('http://localhost:4200/lista/film', {
      id_osobne_liste: lista.id_osobne_liste,
      nazivFilma: movie.value.Naziv_filma,
    });

    $q.notify({
      type: 'positive',
      message: `dodano u "${nazivListe}"`,
    });

  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'greška pri dodavanju.'
    });
  }
};

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

const prepareEdit = (comment) => {
  isEditing.value = true;
  editingCommentId.value = comment.id_komentara;
  newComment.value = {
    sadrzaj: comment.Sadrzaj_komentara,
    ocjena: comment.Ocjena
  };
  commentDialog.value = true;
};

const submitComment = async () => {
  if (!newComment.value.sadrzaj) {
    $q.notify({ type: 'warning', message: 'Napišite tekst komentara!' });
    return;
  }

  const user = getCurrentUser();
  loadingComment.value = true;

  try {
    if (isEditing.value) {
      await api.put(`http://localhost:4200/komentar/${editingCommentId.value}`, {
        sadrzaj: newComment.value.sadrzaj,
        ocjena: newComment.value.ocjena
      });
      $q.notify({ type: 'positive', message: 'Komentar ažuriran!' });
    } else {
        await api.post('http://localhost:4200/komentar', {
          email: user.email,
          film: movie.value.Naziv_filma,
          sadrzaj: newComment.value.sadrzaj,
          ocjena: newComment.value.ocjena
        });
      $q.notify({ type: 'positive', message: 'Hvala na recenziji!' });
    }

    commentDialog.value = false;
    fetchComments();
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Greška prilikom spremanja.' });
  } finally {
    loadingComment.value = false;
  }
};

const deleteComment = (id) => {
  $q.dialog({
    title: 'Potvrda brisanja',
    message: 'Jesi li siguran da želiš trajno obrisati ovaj komentar?',
    cancel: true,
    persistent: true,
    ok: { label: 'Obriši', color: 'negative', flat: true },
    cancel: { label: 'Odustani', color: 'primary', flat: true },
    dark: $q.dark.isActive
  }).onOk(async () => {
    try {
      await api.delete(`http://localhost:4200/komentar/${id}`);
      $q.notify({ type: 'positive', message: 'Komentar uspješno obrisan.', icon: 'delete' });
      fetchComments();
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Greška pri brisanju.' });
    }
  });
};

const confirmAddToList = async () => {
  try {
    await api.post('http://localhost:4200/lista/film', {
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
/* Pozadina cijele stranice */
.page-detail {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  transition: background 0.3s ease;
}

/*  tema za pozadinu aplikacije */
body.body--dark .page-detail {
  background: rgba(255,255,255,0.03) !important;
}

.content { max-width: 1100px; margin: 0 auto; }
.movie-detail-card { border-radius: 20px !important; overflow: hidden; }

/* Profinjeni kinematografski gradijent od skroz crne prema tamnoj nijansi */
.hero-section {
  background: linear-gradient(to right, #26a69a, #12162e);
  min-height: 250px;
}

body.body--dark .movie-detail-card {
  border: 1px solid #1f2937;
}

.detail-icon-container { background: rgba(0, 0, 0, 0); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 1px solid rgba(0, 0, 0, 0); }

/* Pozadina sekcije s detaljima */
.bg-surface {
  background-color: #ffffff;
}
body.body--dark .bg-surface {
  background-color: #000000;
}

/* Info kartice (Godina, Jezik) - ističu se s blagim obrubom u tamnom načinu */
.info-card {
  display: flex;
  align-items: center;
  background: #fdfdfd;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}
body.body--dark .info-card {
  background: #050505;
  border: 1px solid #1e2937;
}

.info-label { font-size: 0.75rem; color: #a0aec0; text-transform: uppercase; font-weight: bold; }

.movie-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
}
body.body--dark .movie-description {
  color: #cbd5e1;
}

/* Stilovi za komentare - suptilno se ističu iz crne pozadine na hover */
.comment-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}
body.body--dark .comment-card {
  background: #050505;
  border: 1px solid #1f2937;
}
.comment-card:hover {
  border-color: #3b82f6;
  background-color: #fafbff;
}
body.body--dark .comment-card:hover {
  border-color: #3b82f6;
  background-color: #0a0f1d;
}

.border-dashed {
  border: 2px dashed #e2e8f0;
  border-radius: 15px;
}
body.body--dark .border-dashed {
  border-color: #334155;
  background: #050505 !important;
}
</style>
