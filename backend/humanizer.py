import re
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag

# Download necessary NLTK datasets quietly if missing
for pkg in ['punkt', 'punkt_tab', 'stopwords', 'wordnet', 'averaged_perceptron_tagger_eng']:
    try:
        nltk.download(pkg, quiet=True)
    except Exception:
        pass

lemmatizer = WordNetLemmatizer()
try:
    stop_words = set(stopwords.words('english'))
except Exception:
    stop_words = set()

PUNCTUATION_TOKENS = {".", ",", "!", "?", ":", ";", "'", "''", "n't", "%", ")", "]", "}"}
OPENING_TOKENS = {"$", "(", "[", "{", "“", '"'}

TECHNICAL_COLLOCATIONS = {
    ("machine", "learning"),
    ("artificial", "intelligence"),
    ("deep", "learning"),
    ("neural", "networks"),
    ("neural", "network"),
    ("data", "analysis"),
    ("data", "science"),
    ("computer", "science"),
    ("cloud", "computing"),
    ("quantum", "computing"),
    ("natural", "language"),
    ("big", "data"),
    ("cyber", "security"),
}


def get_wordnet_pos(treebank_tag):
    """Maps Penn Treebank POS tags to WordNet POS tags (Adjective, Verb, Adverb)."""
    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    return None


def get_wordnet_synonym(word, pos):
    """Finds natural, high-frequency synonym using WordNet."""
    wn_pos = get_wordnet_pos(pos)
    lower_word = word.lower()

    if not wn_pos and (lower_word.endswith("ize") or lower_word.endswith("izes") or lower_word.endswith("ized") or lower_word.endswith("izing")):
        wn_pos = wordnet.VERB

    if not wn_pos or lower_word in stop_words or len(lower_word) < 5:
        return word

    lemma = lemmatizer.lemmatize(lower_word, wn_pos)
    synsets = wordnet.synsets(lemma, pos=wn_pos)
    if not synsets:
        return word

    candidates = []
    for syn in synsets:
        for l in syn.lemmas():
            cand = l.name().lower().replace('_', ' ')
            if cand != lower_word and cand != lemma and cand.isalpha() and len(cand) <= len(lower_word):
                candidates.append((cand, l.count()))

    if not candidates:
        return word

    # Sort candidates by corpus frequency
    candidates.sort(key=lambda x: x[1], reverse=True)
    best_candidate = candidates[0][0]

    # Preserve verb tense
    if wn_pos == wordnet.VERB:
        if pos == 'VBZ' and not best_candidate.endswith('s'):
            best_candidate += 's'
        elif pos == 'VBD' and not best_candidate.endswith('ed'):
            best_candidate += 'ed'
        elif pos == 'VBG' and not best_candidate.endswith('ing'):
            best_candidate += 'ing'

    if word.istitle():
        return best_candidate.capitalize()
    return best_candidate


def humanize(user_text):
    """5-stage NLP humanization pipeline (Tokenize, Clean, POS Tag, Lemmatize, Synonymize)."""
    if not user_text or not user_text.strip():
        return ""

    cleaned_text = re.sub(r'\s+', ' ', user_text.strip())
    cleaned_text = re.sub(r'\s+([.,;:!?])', r'\1', cleaned_text)

    sentences = sent_tokenize(cleaned_text)
    humanized_sentences = []

    for sentence in sentences:
        tokens = word_tokenize(sentence)
        if not tokens:
            continue

        tagged_tokens = pos_tag(tokens)

        # Protect common technical multi-word collocations
        protected_indices = set()
        if len(tokens) >= 2:
            for i in range(len(tokens) - 1):
                bigram = (tokens[i].lower(), tokens[i + 1].lower())
                if bigram in TECHNICAL_COLLOCATIONS:
                    protected_indices.add(i)
                    protected_indices.add(i + 1)

        transformed_words = []
        for idx, (word, pos) in enumerate(tagged_tokens):
            if idx in protected_indices:
                transformed_words.append(word)
            else:
                transformed_words.append(get_wordnet_synonym(word, pos))

        # Reconstruct sentence with natural punctuation and spacing
        reconstructed = ""
        for i, token in enumerate(transformed_words):
            if token in PUNCTUATION_TOKENS:
                reconstructed += token
            elif i == 0 or (i > 0 and transformed_words[i - 1] in OPENING_TOKENS):
                reconstructed += token
            else:
                reconstructed += " " + token

        reconstructed = re.sub(r'\s+([.,;:!?])', r'\1', reconstructed)
        reconstructed = re.sub(r'\(\s+', '(', reconstructed)
        reconstructed = re.sub(r'\s+\)', ')', reconstructed)

        if reconstructed:
            reconstructed = reconstructed[0].upper() + reconstructed[1:]

        humanized_sentences.append(reconstructed)

    result_text = " ".join(humanized_sentences).strip()
    result_text = re.sub(r'\s+', ' ', result_text)
    result_text = re.sub(r'([.?!])\s*([a-z])', lambda m: m.group(1) + " " + m.group(2).upper(), result_text)
   
    return result_text


if __name__ == "__main__":
    sample = "Researchers utilize machine learning algorithms to facilitate rapid data analysis."
    print("Original:", sample)
    print("Humanized:", humanize(sample))
