class Storage {
  #key;
  /**
   * Класс для взаимодействия с localStorage
   * @param {string} key - Ключ localStorage
   */

  constructor(key) {
    this.#key = key;
  }

  /**
   * Метод проверки существования данных
   * @returns {boolean}
   */
  isExist() {
    return !!localStorage.getItem(this.#key);
  }

  /**
   * Метод получения данных
   * @returns {Object}
   */
  get() {
    return JSON.parse(localStorage.getItem(this.#key));
  }

  /**
   * Метод полность заменяет данные
   * @param {Object} data
   */
  set(data) {
    localStorage.setItem(this.#key, JSON.stringify(data));
  }
}
/**
 * Класс изменения состояния списка работников в хранилище
 */
class WorkersListStorage extends Storage {
  /**
   * Мотод добавляет к параметрам работкика id и добавляет в хранилище
   * @param {Class} item - класс работника
   * @returns {WorkersListStorage}
   */
  add(item) {
    this.set([...(this.get() || []), { id: WorkersListStorage.getId(), ...item }]);
    return this;
  }

  /**
   * Метод удаляет работника
   * @param {string} id
   */
  remove(id) {
    this.set(this.get().filter((item) => item.id !== id));
  }

  /**
   * Метод генерации id
   * @returns {integer}
   */
  static getId() {
    return String(Math.floor(Math.random() * 1000000));
  }
}
class Worker {
  #storage;

  static props = [
    { label: 'Имя', name: 'name', type: 'input' },
    { label: 'Компания', name: 'company', type: 'input' },
    { label: 'Пол', name: 'gender', type: 'radio' },
    { label: 'Должность', name: 'post', type: 'select' },
  ];

  static posts = {};

  constructor({ name, post, company, gender }) {
    this.name = name;
    this.post = post;
    this.company = company;
    this.gender = gender;
    this.type = this.constructor.name;
    this.#storage = new WorkersListStorage('workers');
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set post(post) {
    this._post = post;
  }

  get post() {
    return this.post;
  }

  set company(company) {
    this._company = company;
  }

  get company() {
    return this._company;
  }

  set gender(gender) {
    this._gender = gender;
  }

  get gender() {
    return this._gender;
  }

  get storage() {
    return this.#storage;
  }

  static getParams() {
    return Object.keys(this).map((prop) => prop.replace('_', ''));
  }
}
class Driver extends Worker {
  static props = [
    { label: 'Марка автомобиля', name: 'carBrand', type: 'select' },
    {
      label: 'Навык экстремального вождения',
      name: 'isExtremeDrivingSkill',
      type: 'checkbox',
    },
  ];

  constructor({ carBrand, isExtremeDrivingSkill = false, ...rest }) {
    super({ ...rest, post: 'Водитель' });
    this.carBrand = carBrand;
    this.isExtremeDrivingSkill = isExtremeDrivingSkill;
  }

  set carBrand(carBrand) {
    this._carBrand = carBrand;
  }

  get carBrand() {
    return this.carBrand;
  }

  set isExtremeDrivingSkill(isExtremeDrivingSkill) {
    this._isExtremeDrivingSkill = isExtremeDrivingSkill;
  }

  get isExtremeDrivingSkill() {
    return this.isExtremeDrivingSkill;
  }
}
class Plumber extends Worker {
  static props = [
    { label: 'Квалификация', name: 'category', type: 'input' },
    { label: 'Образование', name: 'education', type: 'select' },
  ];

  constructor({ category, education, ...rest }) {
    super({ ...rest, post: 'Сантехник' });
    this.category = category;
    this.education = education;
  }

  set category(category) {
    this._category = category;
  }

  get category() {
    return this.category;
  }

  set education(education) {
    this._education = education;
  }

  get education() {
    return this._education;
  }
}
const workers = {
  driver: Driver,
  plumber: Plumber,
};
class DomElement {
  constructor({ tag = 'div', ...attrs }) {
    this._element = document.createElement(tag);
    this.setAttr(attrs);
  }

  setAttr(attrs) {
    if (Object.keys(attrs).length !== 0) {
      Object.keys(attrs).forEach((attr) => {
        if (attr === 'dataset') {
          Object.keys(attrs[attr]).forEach(
            (key) => (this.element.dataset[`${key}`] = attrs[attr][`${key}`])
          );
        } else {
          this.element[attr] = attrs[attr];
        }
      });
    }
  }

  get element() {
    return this._element;
  }
}
class DomSelect extends DomElement {
  constructor({ options, ...attrs }) {
    super({ tag: 'select', ...attrs });
    this.options = options;
    this.addOptions();
  }

  addOptions() {
    this._element.innerHTML = this.getOptionsHTML();
  }

  getOptionsHTML() {
    const isOptionsListArray = Array.isArray(this.options);
    const optionList = isOptionsListArray ? this.options : Object.keys(this.options);
    return optionList.reduce((optionsHTML, option) => {
      optionsHTML += `<option value="${
        isOptionsListArray ? option : this.options[option]
      }">${option}</option>`;
      return optionsHTML;
    }, '');
  }
}
class DomFormInput extends DomElement {
  constructor({ label, container, ...attrs }) {
    super({ tag: 'input', ...attrs });
    this.label = label;
    this.container = container;
  }

  create() {
    const container = new DomElement({ ...this.container }).element;

    const label = new DomElement({
      tag: 'label',
      ...this.label,
    }).element;

    container.append(label, this.element);
    return container;
  }
}
const storage = new WorkersListStorage('workers');
const render = () => {
  if (storage.isExist()) {
    const data = storage.get();
    const table = new DomElement({
      tag: 'table',
      className: 'table table-striped workers_table',
    }).element;
    const tHead = new DomElement({ tag: 'thead' }).element;
    const tHeadRow = new DomElement({ tag: 'tr' }).element;

    Worker.props.forEach((prop) => {
      const tHeadCol = new DomElement({ tag: 'td', textContent: prop.label }).element;
      tHeadRow.append(tHeadCol);
    });

    tHeadRow.append(
      new DomElement({
        tag: 'td',
        textContent: 'Характеристики',
      }).element,
      new DomElement({
        tag: 'td',
        textContent: '',
      }).element
    );
    tHead.append(tHeadRow);
    const tBody = new DomElement({ tag: 'tbody' }).element;

    data.forEach((dataItem) => {
      const {
        id,
        type,
        _name: name,
        _company: company,
        _gender: gender,
        _post: post,
        ...specifications
      } = dataItem;

      const tBodyRow = new DomElement({ tag: 'tr', dataset: { id } }).element;

      Worker.props.forEach((prop) => {
        const tBodyCol = new DomElement({
          tag: 'td',
          textContent: dataItem[`_${prop.name}`],
        }).element;
        tBodyRow.append(tBodyCol);
      });

      const specificationsCol = new DomElement({ tag: 'td' }).element;
      workers[type.toLowerCase()].props.forEach((prop) => {
        if (specifications[`_${prop.name}`]) {
          specificationsCol.append(
            new DomElement({
              tag: 'p',
              textContent: `${prop.label} ${specifications[`_${prop.name}`]}`,
            }).element
          );
        }
      });

      tBodyRow.append(specificationsCol);

      tBodyRow.append(
        new DomElement({
          tag: 'td',
          innerHTML:
            '<button type="button" class="btn btn-danger btn-sm btn-delete" >Удалить</button>',
        }).element
      );

      tBody.append(tBodyRow);
    });
    table.append(tHead, tBody);
    const workersList = document.querySelector('.workersList');
    workersList.innerHTML = '';
    workersList.append(table);

    table.addEventListener('click', (event) => {
      if ([...event.target.classList].includes('btn-delete')) {
        const { id } = event.target.closest('tr').dataset;
        storage.remove(id);
        render();
      }
    });
  }
};
const selectData = {
  carBrand: {
    'Марка автомобиля: ': '',
    BMW: 'BMW',
    Audi: 'Audi',
    Ford: 'Ford',
    Lada: 'Lada',
    Nissan: 'Nissan',
  },
  gender: ['муж.', 'жен.'],
  education: {
    'Образование: ': '',
    Cреднее: 'Cреднее',
    'Cредне специальное': 'Cредне специальное',
    Высшее: 'Высшее',
  },
  post: { 'Должность: ': '', Водитель: 'driver', Сантехник: 'plumber' },
};

const form = document.querySelector('#add_worker');
form.hidden = true;
const formFieldsBlock = document.querySelector('.fields');
const formAdditionalFieldsBlock = document.querySelector('.additionalFields');
const addWorkerBtn = form.querySelector('button');
const toggleFormBtn = document.querySelector('#toggleForm');

const renderFormFields = (field) => {
  const formFields = [];
  if (field.type === 'input') {
    const formField = new DomFormInput({
      label: { className: 'form-label', textContent: field.label },
      container: { tag: 'div', className: 'mb-3' },
      type: 'text',
      name: field.name,
      required: true,
      minlength: 1,
      className: 'form-control',
    });
    formFields.push(formField.create());
  } else if (field.type === 'radio') {
    selectData[field.name].forEach((label) => {
      const formField = new DomFormInput({
        label: {
          className: 'form-check-label',
          textContent: label,
          for: field.name,
        },
        container: {
          tag: 'div',
          className: 'form-check form-check-inline mb-4',
        },
        type: 'radio',
        value: label,
        required: true,
        name: field.name,
        id: field.name,
        className: 'form-check-input',
      });
      formFields.push(formField.create());
    });
  } else if (field.type === 'checkbox') {
    [field.label].forEach((label) => {
      const formField = new DomFormInput({
        label: {
          className: 'form-check-label',
          textContent: label,
          for: field.name,
        },
        container: {
          tag: 'div',
          className: 'form-check form-check-inline form-switch mb-4',
        },
        type: 'checkbox',
        value: true,
        name: field.name,
        id: field.name,
        className: 'form-check-input',
      });
      formFields.push(formField.create());
    });
  } else if (field.type === 'select') {
    const formField = new DomSelect({
      name: field.name, // ?
      className: 'form-select mb-3',
      id: field.name,
      required: true,
      options: selectData[field.name],
    });
    formFields.push(formField.element);
  }
  return formFields;
};

const workerFormFields = Worker.props;

workerFormFields.forEach((field) => {
  const formFields = renderFormFields(field);
  if (formFields.length !== 0) formFieldsBlock.append(...formFields);
});
render();
toggleFormBtn.addEventListener('click', () => {
  form.hidden = !form.hidden;
});

form.addEventListener('change', (event) => {
  const { name } = event.target;

  if (name === 'post') {
    formAdditionalFieldsBlock.innerHTML = '';
    const { props } = workers[event.target.value];
    props.forEach((field) => {
      const formFields = renderFormFields(field);
      if (formFields.length !== 0) {
        formAdditionalFieldsBlock.append(...formFields);
      }
    });
  }
});
addWorkerBtn.addEventListener('click', (event) => {
  if (form.checkValidity()) {
    event.preventDefault();

    const data = new FormData(form);
    const props = {};
    for (const entry of data) {
      const [key, value] = entry;
      props[key] = value;
    }

    const worker = new workers[form.post.value](props);
    worker.storage.add(worker);
    render();
    document
      .querySelector('form')
      .querySelectorAll('*[name]')
      .forEach((field) => {
        if (field.type === 'radio' || field.type === 'checkbox') {
          field.checked = false;
        } else {
          field.value = '';
        }
      });
  }
});
