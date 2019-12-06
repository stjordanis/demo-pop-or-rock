var app = {
    isInit: false
};

((app) => {
    class API {
        constructor(endpoint) {
            this._endpoint = endpoint;
        }
        classifyLyrics(lyrics) {
            return fetch(`${this._endpoint}/api/classify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "lyrics": lyrics})
            }).then(response => response.json());
        }
        getResponseImage(genre) {
            const params = new URLSearchParams({ "genre": genre });
            return fetch(`${this._endpoint}/api/image?${params.toString()}`)
              .then(response => response.json())
              .then(result => result.image);
        }
    }

    const ErrorTypes = Object.freeze({
        "validation": "validation",
        "service": "service"
    });

    class View {
        constructor(elementId) {
            this.element = document.getElementById(elementId);
        }
        get disabled() {
            return this.hasCustomAttribute("disabled");
        }
        set disabled(value) {
            this.setCustomAttribute("disabled", value ? "disabled" : null);
        }
        get hidden() {
            return this.element.hasAttribute("hidden");
        }
        set hidden(value) {
            this.setCustomAttribute("data-hidden", value ? "data-hidden" : null);
        }
        get state() {
            return this.getCustomAttribute("data-state");
        }
        set state(value) {
            this.setCustomAttribute("data-state", value);
        }
        get content() {
            return this.element.innerHTML;
        }
        set content(html) {
            this.element.innerHTML = html;
        }
        setCustomAttribute(attr, value) {
            if (!value) {
                this.element.removeAttribute(attr);
                return;
            }
            this.element.setAttribute(attr, value);
        }
        getCustomAttribute(attr) {
            return this.element.getAttribute(attr);
        }
        hasCustomAttribute(attr) {
            return this.element.hasAttribute(attr);
        }
    }
    const MainViewStates = Object.freeze({
        "Result": "result",
        "Input": "input"
    });

    class MainView extends View {
        constructor() {
            super("main-view");
        }
        setViewState(state, params) {
            let dataState = MainViewStates.Input;
            if (state === MainViewStates.Result) {
                dataState = MainViewStates.Result + "-" + params.genre;
            }
            this.state = dataState;
        }
    }

    class ResultView extends View {
        constructor() {
            super("result-view");
            this._restartButton = new View("restart-button");
            this._imageView = new View("result-image");
            this._textView = new View("lyrics-text");
        }
        set onRestart(handler) {
            this._restartButton.element.onclick = handler;
        }
        get onRestart() {
            return this._restartButton.element.onclick;
        }
        setViewState(genre, imageUrl, lyrics) {
            let url = null;
            if (imageUrl) {
                this._imageView.hidden = false;
                url = imageUrl;
            } else {
                this._imageView.hidden = true;
            }

            this._imageView.setCustomAttribute("src", url);
            this._textView.content = lyrics ? "" : lyrics;
            if (genre) {
                this.state = genre;
            }
        }
    }

    const InputViewStates = Object.freeze({
        "loading": "loading",
        "serviceError": "service-error",
        "validationError": "validation-error",
        "idle": "idle"
    });


    class InputView extends View {
        constructor() {
            super("input-view");
            this._input = new View("lyrics");
            this._form = new View("lyrics-form");
            this._button = new View("submit");
        }
        set onSubmit(handler) {
            this._form.element.onsubmit = handler;
        }
        get onSubmit() {
            return this._form.element.onsubmit;
        }
        setViewState(inputState) {
            this._form.state = inputState;
            switch (inputState) {
                case InputViewStates.loading:
                    this._button.disabled = true;
                    break;
                case InputViewStates.error:
                case InputViewStates.idle:
                    this._button.disabled = false;
                    break;
            }
        }
        validateInputText() {
            const text = this.getInputText();
            return (text.length > 24 && text.split(" ").length > 8);
        }
        getInputText() {
            return this._input.element.value;
        }

        clearInputText() {
            this._input.element.value = "";
        }
    }

    class App {
        constructor(api) {
            this._api = api;
            this._isLoading = false;
            this._resultView = new ResultView(this);
            this._inputView = new InputView(this);
            this._mainView = new MainView();
            this._inputView.onSubmit = this.onSubmitLyrics.bind(this);
            this._resultView.onRestart = this.onClickRestart.bind(this);
        }

        // event listeners
        onSubmitLyrics() {
            if (!this._isLoading) {
                if (this._inputView.validateInputText()) {
                    this.doSubmitLyrics(this._inputView.getInputText());
                } else {
                    this.showError(ErrorTypes.validation);
                }
            }
            return false;
        }
        onClickRestart() {
            this.doRestart();
            return false;
        }

        // handlers
        doSubmitLyrics(text) {
            this._isLoading = true;
            this._resultView.setViewState();
            this._inputView.setViewState(InputViewStates.loading);
            return this._api.classifyLyrics(text)
              .then(result => {
                  let genreMap = result.genre;
                  // Response format example: {"rock": 0.234323, "pop": 0.765677 }
                  // Go through all items and pick the highest score:
                  let genre = Object.keys(genreMap).reduce((p, c) => genreMap[c] > genreMap[p] ? c : p).toLowerCase();
                  return this._api.getResponseImage(genre)
                    .catch((err) => {
                        return (genre === "pop") ? "/images/this_is_pop.jpg" : "/images/this_is_rock.jpg";
                    })
                    .then((imageUrl) => {
                        this._isLoading = false;
                        this._inputView.setViewState(InputViewStates.idle);
                        return { /* resultData */
                            genre: genre,
                            imageUrl: imageUrl,
                            lyrics: text
                        };
                    });
              })
              .then(resultData => this.showResult(resultData))
              .catch(err => {
                  this._isLoading = false;
                  this.showError(ErrorTypes.service, err);
              } );
        }
        doRestart() {
            this._inputView.setViewState(InputViewStates.idle);
            this._inputView.clearInputText();
            this.showInput();
            return false;
        }

        // states
        showResult(resultData) {
            this._mainView.setViewState(MainViewStates.Result, resultData);
            this._resultView.setViewState(resultData.genre, resultData.imageUrl, resultData.lyrics);
            this._inputView.hidden = true;
            this._resultView.hidden = false;
        }
        showInput() {
            this._resultView.hidden = true;
            this._inputView.hidden = false;
            this._mainView.setViewState(MainViewStates.Input);
        }
        showError(errorType, msg) {
            switch (errorType) {
                case ErrorTypes.validation:
                    this._inputView.setViewState(InputViewStates.validationError);
                    break;
                case ErrorTypes.service:
                    this._inputView.setViewState(InputViewStates.serviceError);
                    break;
            }
        }
    }
    const baseUrl = window.location.href.split("/").slice(0, 3).join("/");
    app.main = new App(new API(baseUrl));
    app.isInit = true;
})(app);